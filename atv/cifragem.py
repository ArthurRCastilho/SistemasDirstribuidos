import math
import hashlib

# Verifica se é primo
def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            return False
    return True

# Máximo divisor comum
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

# Inverso modular
def mod_inverse(e, phi):
    for d in range(3, phi):
        if (d * e) % phi == 1:
            return d
    return None

# Gerar chaves
def gerar_chaves(p, q):
    if not (is_prime(p) and is_prime(q)):
        raise ValueError("Ambos os números devem ser primos.")
    
    n = p * q
    phi = (p - 1) * (q - 1)

    e = 3
    while gcd(e, phi) != 1:
        e += 2

    d = mod_inverse(e, phi)

    return ((n, e), (n, d))  # pública, privada

# 2 Cifragem
# Cifra a mensagem (como lista de inteiros)
def cifrar(mensagem, chave_publica):
    n, e = chave_publica
    mensagem_cifrada = [pow(ord(char), e, n) for char in mensagem]
    return mensagem_cifrada

# 3 Desifragem
# Decifra a lista de inteiros para a string original
def decifrar(mensagem_cifrada, chave_privada):
    n, d = chave_privada
    mensagem = ''.join([chr(pow(char, d, n)) for char in mensagem_cifrada])
    return mensagem


# 4 Hash
def gerar_hash(mensagem):
    hash_obj = hashlib.sha256(mensagem.encode())
    return hash_obj.hexdigest()


if __name__ == "__main__":
    # 1. Gerar chaves
    p = int(input("Digite o número primo p: "))
    q = int(input("Digite o número primo q: "))
    
    pub, priv = gerar_chaves(p, q)
    print("\nChave pública:", pub)
    print("Chave privada:", priv)

    # 2. Cifrar
    mensagem = input("\nDigite a mensagem a ser cifrada: ")
    mensagem_cifrada = cifrar(mensagem, pub)
    print("Mensagem Cifrada:", mensagem_cifrada)

    # 3. Decifrar
    mensagem_decifrada = decifrar(mensagem_cifrada, priv)
    print("Mensagem Decifrada:", mensagem_decifrada)

    # 4. Gerar Hash
    hash_resultado = gerar_hash(mensagem)
    print("Hash SHA-256 da mensagem:", hash_resultado)
