"""
FedMed TenSEAL CKKS Homomorphic Encryption Wrapper
Enables homomorphic vector addition and scalar multiplication for privacy-preserving model aggregation.
"""

import tenseal as ts
import numpy as np
from typing import List, Tuple

class TenSEALContextManager:
    def __init__(self, poly_modulus_degree: int = 8192, coeff_mod_bit_sizes: List[int] = None):
        if coeff_mod_bit_sizes is None:
            coeff_mod_bit_sizes = [60, 40, 40, 60]
            
        self.poly_modulus_degree = poly_modulus_degree
        self.coeff_mod_bit_sizes = coeff_mod_bit_sizes
        
        # Initialize TenSEAL CKKS context
        self.context = ts.context(
            ts.SCHEME_TYPE.CKKS,
            poly_modulus_degree=self.poly_modulus_degree,
            coeff_mod_bit_sizes=self.coeff_mod_bit_sizes
        )
        self.context.global_scale = 2 ** 40
        self.context.generate_galois_keys()
        self.context.generate_relin_keys()

    def encrypt_vector(self, plain_vector: np.ndarray) -> ts.CKKSVector:
        """Encrypts a 1D or flattened NumPy tensor into CKKS Ciphertext."""
        flat_vec = plain_vector.flatten().tolist()
        encrypted_vec = ts.ckks_vector(self.context, flat_vec)
        return encrypted_vec

    def decrypt_vector(self, encrypted_vec: ts.CKKSVector, shape: Tuple[int, ...]) -> np.ndarray:
        """Decrypts CKKS Ciphertext back into NumPy tensor with target shape."""
        decrypted_list = encrypted_vec.decrypt()
        return np.array(decrypted_list, dtype=np.float32).reshape(shape)

    def homomorphic_add(self, vec1: ts.CKKSVector, vec2: ts.CKKSVector) -> ts.CKKSVector:
        """Performs homomorphic addition on two encrypted ciphertexts: E(A) + E(B) = E(A + B)."""
        return vec1 + vec2

    def homomorphic_scale(self, vec: ts.CKKSVector, scalar: float) -> ts.CKKSVector:
        """Performs scalar multiplication on encrypted ciphertext: c * E(A) = E(c * A)."""
        return vec * scalar
