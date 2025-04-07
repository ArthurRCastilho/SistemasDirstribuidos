import math

# Função para verificar se um número é primo
def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            return False
    return True

# Função para calcular o máximo divisor comum (MDC)
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

# Função para encontrar o inverso modular
def mod_inverse(e, phi):
    for d in range(3, phi):
        if (d * e) % phi == 1:
            return d
    return None

# Função principal
def gerar_chaves():
    # Solicita dois números primos
    p = int(input("Digite um número primo p: "))
    q = int(input("Digite um número primo q: "))

    if not (is_prime(p) and is_prime(q)):
        print("Ambos os números devem ser primos.")
        return

    n = p * q
    phi = (p - 1) * (q - 1)

    # Escolher um 'e' que seja coprimo com phi e 1 < e < phi
    e = 3
    while gcd(e, phi) != 1:
        e += 2  # e ímpar e diferente de múltiplos de pequenos fatores

    # Calcular d, o inverso modular de e
    d = mod_inverse(e, phi)
    if d is None:
        print("Não foi possível encontrar o inverso modular.")
        return

    print("\n--- Chaves Geradas ---")
    print(f"Chave pública (n, e): ({n}, {e})")
    print(f"Chave privada (n, d): ({n}, {d})")

# Executar
gerar_chaves()
