from graphviz import Digraph

def create_backend_flow_diagram():
    dot = Digraph("Backend Flow", format="png")
    
    # Nós principais
    dot.node("Cliente", "Cliente")
    dot.node("Rotas", "Rotas")
    dot.node("Controlador", "Controlador")
    dot.node("Validador", "Validador")
    dot.node("Modelo", "Modelo")
    dot.node("BancoDeDados", "Banco de Dados")
    dot.node("Resposta", "Resposta ao Cliente")
    
    # Fluxo de conexão
    dot.edge("Cliente", "Rotas", label="Requisição HTTP")
    dot.edge("Rotas", "Controlador", label="Chama")
    dot.edge("Controlador", "Validador", label="Valida com")
    dot.edge("Controlador", "Modelo", label="Interage com")
    dot.edge("Modelo", "BancoDeDados", label="Consulta")
    dot.edge("BancoDeDados", "Modelo", label="Retorna dados")
    dot.edge("Modelo", "Controlador", label="Envia dados")
    dot.edge("Controlador", "Resposta", label="Retorna")
    dot.edge("Resposta", "Cliente", label="Envia")
    
    # Gerar diagrama
    dot.render("backend_flow", format="png", cleanup=True)
    print("Diagrama gerado como 'backend_flow.png'")

# Criar o diagrama
type(create_backend_flow_diagram())
