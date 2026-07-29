"""
FedMed 3D U-Net Neural Network Architecture (PyTorch / MONAI Specification)
Designed for 3D Brain Tumor (Glioma) and Multi-Organ MRI Segmentation.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F

class DoubleConv3D(nn.Module):
    def __init__(self, in_channels: int, out_channels: int):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv3d(in_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm3d(out_channels),
            nn.ReLU(inplace=True),
            nn.Conv3d(out_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm3d(out_channels),
            nn.ReLU(inplace=True)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.conv(x)

class UNet3D(nn.Module):
    def __init__(self, in_channels: int = 1, out_channels: int = 3, feature_maps: list = [32, 64, 128, 256]):
        super().__init__()
        self.encoder1 = DoubleConv3D(in_channels, feature_maps[0])
        self.pool1 = nn.MaxPool3d(2)
        
        self.encoder2 = DoubleConv3D(feature_maps[0], feature_maps[1])
        self.pool2 = nn.MaxPool3d(2)
        
        self.encoder3 = DoubleConv3D(feature_maps[1], feature_maps[2])
        self.pool3 = nn.MaxPool3d(2)
        
        self.bottleneck = DoubleConv3D(feature_maps[2], feature_maps[3])
        
        self.up3 = nn.ConvTranspose3d(feature_maps[3], feature_maps[2], kernel_size=2, stride=2)
        self.decoder3 = DoubleConv3D(feature_maps[3], feature_maps[2])
        
        self.up2 = nn.ConvTranspose3d(feature_maps[2], feature_maps[1], kernel_size=2, stride=2)
        self.decoder2 = DoubleConv3D(feature_maps[2], feature_maps[1])
        
        self.up1 = nn.ConvTranspose3d(feature_maps[1], feature_maps[0], kernel_size=2, stride=2)
        self.decoder1 = DoubleConv3D(feature_maps[1], feature_maps[0])
        
        self.final_conv = nn.Conv3d(feature_maps[0], out_channels, kernel_size=1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Encoder
        enc1 = self.encoder1(x)
        enc2 = self.encoder2(self.pool1(enc1))
        enc3 = self.encoder3(self.pool2(enc2))
        
        # Bottleneck
        bottleneck = self.bottleneck(self.pool3(enc3))
        
        # Decoder
        dec3 = self.up3(bottleneck)
        dec3 = torch.cat([dec3, enc3], dim=1)
        dec3 = self.decoder3(dec3)
        
        dec2 = self.up2(dec3)
        dec2 = torch.cat([dec2, enc2], dim=1)
        dec2 = self.decoder2(dec2)
        
        dec1 = self.up1(dec2)
        dec1 = torch.cat([dec1, enc1], dim=1)
        dec1 = self.decoder1(dec1)
        
        logits = self.final_conv(dec1)
        return torch.sigmoid(logits)

def compute_dice_score(pred: torch.Tensor, target: torch.Tensor, smooth: float = 1e-6) -> float:
    """Computes mean Dice Similarity Coefficient (DSC) for multi-class 3D segmentation."""
    pred = (pred > 0.5).float()
    intersection = (pred * target).sum()
    union = pred.sum() + target.sum()
    dice = (2.0 * intersection + smooth) / (union + smooth)
    return dice.item()
