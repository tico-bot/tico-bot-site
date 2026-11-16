/* Catálogo da área administrativa — espelhado dos catálogos reais do Tico Bot.
 * Ao criar itens no bot, actualize esta lista usando as fontes em src/config/economia.js,
 * handlers/diversao/pesca.js, roubo.js e acessoriosCasal.js.
 */
(function (global) {
  'use strict';
  global.TICO_ADMIN_ITEM_CATALOG = Object.freeze([
  {
    "id": "loja-comida",
    "label": "🍔 Loja · Alimentação (8)",
    "itens": [
      {
        "key": "bolo",
        "nome": "Bolo de Aniversário"
      },
      {
        "key": "cerveja",
        "nome": "Cerveja"
      },
      {
        "key": "chocolate",
        "nome": "Chocolate"
      },
      {
        "key": "frango",
        "nome": "Frango Frito"
      },
      {
        "key": "hamburger",
        "nome": "Hamburger Simples"
      },
      {
        "key": "picanha",
        "nome": "Picanha"
      },
      {
        "key": "pizza",
        "nome": "Pizza Margherita"
      },
      {
        "key": "refrigerante",
        "nome": "Refrigerante"
      }
    ]
  },
  {
    "id": "loja-petcomida",
    "label": "🦴 Loja · Alimentação de pets (5)",
    "itens": [
      {
        "key": "carnefresh",
        "nome": "Carne Fresca"
      },
      {
        "key": "leite",
        "nome": "Leite"
      },
      {
        "key": "peixe",
        "nome": "Peixe Fresco"
      },
      {
        "key": "racao",
        "nome": "Ração Normal"
      },
      {
        "key": "racaopremium",
        "nome": "Ração Premium"
      }
    ]
  },
  {
    "id": "loja-petbrinquedo",
    "label": "🎾 Loja · Brinquedos de pets (5)",
    "itens": [
      {
        "key": "bolinha",
        "nome": "Bolinha de Tênis"
      },
      {
        "key": "casabrinquedo",
        "nome": "Casa de Brinquedo"
      },
      {
        "key": "corda",
        "nome": "Corda de Puxar"
      },
      {
        "key": "disco",
        "nome": "Disco Voador"
      },
      {
        "key": "pelucia",
        "nome": "Pelúcia"
      }
    ]
  },
  {
    "id": "loja-petcuidado",
    "label": "🩺 Loja · Cuidados de pets (4)",
    "itens": [
      {
        "key": "remedio",
        "nome": "Remédio Geral"
      },
      {
        "key": "sabonete",
        "nome": "Sabonete Pet"
      },
      {
        "key": "shampoo",
        "nome": "Shampoo Especial"
      },
      {
        "key": "vacina",
        "nome": "Vacina"
      }
    ]
  },
  {
    "id": "loja-petacessorio",
    "label": "🎀 Loja · Acessórios de pets (4)",
    "itens": [
      {
        "key": "bandana",
        "nome": "Bandana"
      },
      {
        "key": "coleira",
        "nome": "Coleira Colorida"
      },
      {
        "key": "coleiraouro",
        "nome": "Coleira de Ouro"
      },
      {
        "key": "coroa",
        "nome": "Coroa Pet"
      }
    ]
  },
  {
    "id": "loja-especial",
    "label": "⭐ Loja · Itens especiais (4)",
    "itens": [
      {
        "key": "cristal",
        "nome": "Cristal Mágico"
      },
      {
        "key": "gema",
        "nome": "Gema Brilhante"
      },
      {
        "key": "pocaoenergia",
        "nome": "Poção de Energia"
      },
      {
        "key": "trofeu",
        "nome": "Troféu Miniatura"
      }
    ]
  },
  {
    "id": "loja-pet",
    "label": "🐾 Loja · Pets (3)",
    "itens": [
      {
        "key": "cachorro",
        "nome": "Cachorro"
      },
      {
        "key": "coelho",
        "nome": "Coelho"
      },
      {
        "key": "gato",
        "nome": "Gato"
      }
    ]
  },
  {
    "id": "loja-casal",
    "label": "💕 Loja · Presentes de casal (8)",
    "itens": [
      {
        "key": "anel",
        "nome": "Anel"
      },
      {
        "key": "caixa",
        "nome": "Caixa Presente Luxo"
      },
      {
        "key": "carta",
        "nome": "Carta de Amor"
      },
      {
        "key": "flores",
        "nome": "Flores"
      },
      {
        "key": "garrafa",
        "nome": "Garrafa Vinho Tinto"
      },
      {
        "key": "morango",
        "nome": "Morango com Chocolate"
      },
      {
        "key": "perfume",
        "nome": "Perfume Premium"
      },
      {
        "key": "urso",
        "nome": "Ursinho de Pelúcia"
      }
    ]
  },
  {
    "id": "loja-estilo",
    "label": "👕 Loja · Vestuário (3)",
    "itens": [
      {
        "key": "calcas",
        "nome": "Calças"
      },
      {
        "key": "camiseta",
        "nome": "Camiseta"
      },
      {
        "key": "sapato",
        "nome": "Sapato"
      }
    ]
  },
  {
    "id": "loja-tec",
    "label": "💻 Loja · Tecnologia (8)",
    "itens": [
      {
        "key": "celular",
        "nome": "Celular"
      },
      {
        "key": "fonesemfio",
        "nome": "Fone Sem Fio"
      },
      {
        "key": "monitor24",
        "nome": "Monitor 24\""
      },
      {
        "key": "mousegamer",
        "nome": "Mouse Gamer"
      },
      {
        "key": "notebook",
        "nome": "Notebook Gamer"
      },
      {
        "key": "pcgamerlegendario",
        "nome": "PC Gamer Lendário"
      },
      {
        "key": "smartphonebasico",
        "nome": "Smartphone Básico"
      },
      {
        "key": "ssd1tb",
        "nome": "SSD 1TB"
      }
    ]
  },
  {
    "id": "pesca-varas",
    "label": "🎣 Pesca · Varas (14)",
    "itens": [
      {
        "key": "vara_divina",
        "nome": "⚡ Vara Divina"
      },
      {
        "key": "vara_carbono",
        "nome": "⚫ Vara de Carbono"
      },
      {
        "key": "vara_lendaria",
        "nome": "✨ Vara Lendária"
      },
      {
        "key": "vara_sombria",
        "nome": "🌑 Vara das Sombras"
      },
      {
        "key": "vara_galho",
        "nome": "🌿 Vara de Galho"
      },
      {
        "key": "vara_bambu",
        "nome": "🎋 Vara de Bambu"
      },
      {
        "key": "vara_fibra",
        "nome": "🎣 Vara de Fibra"
      },
      {
        "key": "vara_amaldiçoada",
        "nome": "💀 Vara Amaldiçoada"
      },
      {
        "key": "vara_cristal",
        "nome": "💠 Vara de Cristal"
      },
      {
        "key": "vara_reforçada",
        "nome": "🔧 Vara Reforçada"
      },
      {
        "key": "vara_titanio",
        "nome": "🔩 Vara de Titânio"
      },
      {
        "key": "vara_magica",
        "nome": "🪄 Vara Mágica"
      },
      {
        "key": "vara_madeira",
        "nome": "🪵 Vara de Madeira"
      },
      {
        "key": "vara_coral",
        "nome": "🪸 Vara de Coral"
      }
    ]
  },
  {
    "id": "pesca-iscas",
    "label": "🪱 Pesca · Iscas (14)",
    "itens": [
      {
        "key": "isca_divina",
        "nome": "✨ Isca Divina"
      },
      {
        "key": "isca_vulcânica",
        "nome": "🌋 Isca Vulcânica"
      },
      {
        "key": "isca_sombria",
        "nome": "🌑 Isca das Sombras"
      },
      {
        "key": "isca_magica",
        "nome": "🌟 Isca Mágica"
      },
      {
        "key": "isca_polvo",
        "nome": "🐙 Polvo Pequeno"
      },
      {
        "key": "isca_peixinho",
        "nome": "🐟 Peixinho Vivo"
      },
      {
        "key": "isca_cristal",
        "nome": "💎 Isca de Cristal"
      },
      {
        "key": "isca_caranguejo",
        "nome": "🦀 Caranguejo"
      },
      {
        "key": "isca_camarao",
        "nome": "🦐 Camarão"
      },
      {
        "key": "isca_lula",
        "nome": "🦑 Lula"
      },
      {
        "key": "isca_grilo",
        "nome": "🦗 Grilo"
      },
      {
        "key": "isca_sangue",
        "nome": "🩸 Isca de Sangue"
      },
      {
        "key": "isca_mosca",
        "nome": "🪰 Mosca Artificial"
      },
      {
        "key": "isca_minhoca",
        "nome": "🪱 Minhoca"
      }
    ]
  },
  {
    "id": "pesca-achados",
    "label": "🐟 Pesca · Peixes e achados (76)",
    "itens": [
      {
        "key": "ampulheta",
        "nome": "⏳ Ampulheta Antiga"
      },
      {
        "key": "peixe_temporal",
        "nome": "⏳ Peixe Temporal"
      },
      {
        "key": "guarda_chuva",
        "nome": "☂️ Guarda-chuva Quebrado"
      },
      {
        "key": "peixe_venenoso",
        "nome": "☠️ Peixe Venenoso"
      },
      {
        "key": "espada_enferrujada",
        "nome": "⚔️ Espada Enferrujada"
      },
      {
        "key": "peixe_espada",
        "nome": "⚔️ Peixe-Espada"
      },
      {
        "key": "reliquiario",
        "nome": "⚗️ Relicário Místico"
      },
      {
        "key": "enguia",
        "nome": "⚡ Enguia Elétrica"
      },
      {
        "key": "peixe_dourado",
        "nome": "✨ Peixe Dourado"
      },
      {
        "key": "peixe_gelo",
        "nome": "❄️ Peixe de Gelo"
      },
      {
        "key": "estrela_do_mar",
        "nome": "⭐ Estrela-do-Mar"
      },
      {
        "key": "peixe_lendario",
        "nome": "🌈 Peixe Arco-Íris"
      },
      {
        "key": "arraia",
        "nome": "🌊 Arraia Gigante"
      },
      {
        "key": "peixe_celestial",
        "nome": "🌠 Peixe Celestial"
      },
      {
        "key": "flores",
        "nome": "🌹 Flores"
      },
      {
        "key": "alga",
        "nome": "🌿 Monte de Algas"
      },
      {
        "key": "cogumelo_aqua",
        "nome": "🍄 Cogumelo Aquático"
      },
      {
        "key": "chocolate",
        "nome": "🍫 Chocolate"
      },
      {
        "key": "garrafa_vazia",
        "nome": "🍾 Garrafa Vazia"
      },
      {
        "key": "truta",
        "nome": "🎣 Truta"
      },
      {
        "key": "mascara",
        "nome": "🎭 Máscara"
      },
      {
        "key": "harpa_sereia",
        "nome": "🎵 Harpa de Sereia"
      },
      {
        "key": "calice_dourado",
        "nome": "🏆 Cálice Dourado"
      },
      {
        "key": "dragao_aquatico",
        "nome": "🐉 Dragão Aquático"
      },
      {
        "key": "leviatã",
        "nome": "🐋 Leviatã Miniatura"
      },
      {
        "key": "kraken_filhote",
        "nome": "🐙 Filhote de Kraken"
      },
      {
        "key": "concha_quebrada",
        "nome": "🐚 Concha Quebrada"
      },
      {
        "key": "peixe_pequeno",
        "nome": "🐟 Peixe Pequeno"
      },
      {
        "key": "sardinha",
        "nome": "🐟 Sardinha"
      },
      {
        "key": "peixe_listrado",
        "nome": "🐠 Peixe Listrado"
      },
      {
        "key": "peixe_medio",
        "nome": "🐠 Peixe Médio"
      },
      {
        "key": "peixe_gordinho",
        "nome": "🐡 Peixe Gordinho"
      },
      {
        "key": "peixe_grande",
        "nome": "🐡 Peixe Grande"
      },
      {
        "key": "coroa_afundada",
        "nome": "👑 Coroa Afundada"
      },
      {
        "key": "calcinha_perdida",
        "nome": "👙 Roupa Molhada"
      },
      {
        "key": "bota_velha",
        "nome": "👢 Bota Velha"
      },
      {
        "key": "peixe_fantasma",
        "nome": "👻 Peixe Fantasma"
      },
      {
        "key": "anel_perdido",
        "nome": "💍 Anel Perdido"
      },
      {
        "key": "tesouro",
        "nome": "💎 Cristal do Fundo"
      },
      {
        "key": "cristal_tempo",
        "nome": "💠 Cristal do Tempo"
      },
      {
        "key": "livro_submerso",
        "nome": "📖 Livro Submerso"
      },
      {
        "key": "tomo_abissal",
        "nome": "📚 Tomo Abissal"
      },
      {
        "key": "garrafa_mensagem",
        "nome": "📜 Garrafa com Mensagem"
      },
      {
        "key": "cofre_miniatura",
        "nome": "🔒 Cofre Miniatura"
      },
      {
        "key": "peixe_fogo",
        "nome": "🔥 Peixe de Fogo"
      },
      {
        "key": "lanterna_fundo",
        "nome": "🔦 Lanterna do Fundo"
      },
      {
        "key": "telescopio",
        "nome": "🔭 Telescópio Antigo"
      },
      {
        "key": "orbe_magico",
        "nome": "🔮 Orbe Mágico"
      },
      {
        "key": "amuleto_poseidon",
        "nome": "🔱 Amuleto de Poseidon"
      },
      {
        "key": "tridente_poseidon",
        "nome": "🔱 Tridente de Poseidon"
      },
      {
        "key": "peixe_voador",
        "nome": "🕊️ Peixe Voador"
      },
      {
        "key": "tinta_magica",
        "nome": "🖋️ Tinta Mágica"
      },
      {
        "key": "mapa_afundado",
        "nome": "🗺️ Mapa Afundado"
      },
      {
        "key": "mapa_estelar",
        "nome": "🗺️ Mapa Estelar"
      },
      {
        "key": "estatueta",
        "nome": "🗿 Estatueta Antiga"
      },
      {
        "key": "ovo_dragao",
        "nome": "🥚 Ovo de Dragão"
      },
      {
        "key": "lata_enferrujada",
        "nome": "🥫 Lata Enferrujada"
      },
      {
        "key": "tubarao_pequeno",
        "nome": "🦈 Tubarão Filhote"
      },
      {
        "key": "peixe_abissal",
        "nome": "🦑 Peixe Abissal"
      },
      {
        "key": "perola",
        "nome": "🦪 Pérola Rara"
      },
      {
        "key": "osso_peixe",
        "nome": "🦴 Espinha de Peixe"
      },
      {
        "key": "dente_tubarao",
        "nome": "🦷 Dente de Tubarão"
      },
      {
        "key": "piranha",
        "nome": "🦷 Piranha"
      },
      {
        "key": "armadura_sereia",
        "nome": "🧜 Armadura de Sereia"
      },
      {
        "key": "sereia_escama",
        "nome": "🧜 Escama de Sereia"
      },
      {
        "key": "meia_velha",
        "nome": "🧦 Meia Velha"
      },
      {
        "key": "frasco_poção",
        "nome": "🧪 Frasco com Poção"
      },
      {
        "key": "bussola_quebrada",
        "nome": "🧭 Bússola Quebrada"
      },
      {
        "key": "boneco_pano",
        "nome": "🪆 Boneco de Pano"
      },
      {
        "key": "moeda_antiga",
        "nome": "🪙 Moeda Antiga"
      },
      {
        "key": "espelho_abissal",
        "nome": "🪞 Espelho Abissal"
      },
      {
        "key": "corda",
        "nome": "🪢 Corda Ninja"
      },
      {
        "key": "pedra_rio",
        "nome": "🪨 Pedra do Rio"
      },
      {
        "key": "pena_rara",
        "nome": "🪶 Pena Rara"
      },
      {
        "key": "bagre",
        "nome": "😶 Bagre"
      },
      {
        "key": "pneu_velho",
        "nome": "🛞 Pneu Velho"
      }
    ]
  },
  {
    "id": "roubo-ferramentas",
    "label": "🕵️ Roubo · Ferramentas (8)",
    "itens": [
      {
        "key": "cavador",
        "nome": "⛏️ Picareta de Diamante"
      },
      {
        "key": "mascara",
        "nome": "🎭 Máscara"
      },
      {
        "key": "dinamite",
        "nome": "💣 Dinamite"
      },
      {
        "key": "explorador",
        "nome": "📡 Detector de Alarmes"
      },
      {
        "key": "lockpick",
        "nome": "🔓 Kit de Arrombamento"
      },
      {
        "key": "chave",
        "nome": "🔧 Chave Inglesa"
      },
      {
        "key": "disfarce",
        "nome": "🕵️ Disfarce Premium"
      },
      {
        "key": "corda",
        "nome": "🪢 Corda Ninja"
      }
    ]
  },
  {
    "id": "roubo-banco",
    "label": "🏦 Roubo bancário · Ferramentas (5)",
    "itens": [
      {
        "key": "pulso_emp",
        "nome": "⚡ Pulso Eletromagnético"
      },
      {
        "key": "clone_cartao",
        "nome": "💳 Clonador de Cartões"
      },
      {
        "key": "macarico_cofre",
        "nome": "🔥 Maçarico para Cofre"
      },
      {
        "key": "tuneladora",
        "nome": "🚜 Tuneladora de Alta Pressão"
      },
      {
        "key": "furadeira",
        "nome": "🛠️ Furadeira Industrial"
      }
    ]
  },
  {
    "id": "seguranca",
    "label": "🛡️ Segurança · Defesas (12)",
    "itens": [
      {
        "key": "cofre_titanio",
        "nome": "🏦 Cofre Blindado de Titânio"
      },
      {
        "key": "cachorro",
        "nome": "🐕 Cão de Guarda"
      },
      {
        "key": "seguranca",
        "nome": "👮 Guarda de Segurança"
      },
      {
        "key": "camera",
        "nome": "📹 Câmera de Vigilância"
      },
      {
        "key": "cofre",
        "nome": "🔐 Cofre Forte"
      },
      {
        "key": "laser",
        "nome": "🔴 Raios Laser"
      },
      {
        "key": "equipe_elite",
        "nome": "🦾 Equipe de Segurança de Elite"
      },
      {
        "key": "central_ia",
        "nome": "🧠 Central de Segurança com IA"
      },
      {
        "key": "militares",
        "nome": "🪖 Segurança Militar"
      },
      {
        "key": "drones_taticos",
        "nome": "🚁 Enxame de Drones Táticos"
      },
      {
        "key": "alarme",
        "nome": "🚨 Sistema de Alarme"
      },
      {
        "key": "bunker",
        "nome": "🛡️ Bunker Subterrâneo"
      }
    ]
  },
  {
    "id": "casal-equipaveis",
    "label": "💍 Casal · Acessórios equipáveis (6)",
    "itens": [
      {
        "key": "anel",
        "nome": "Anel"
      },
      {
        "key": "camisetacasal",
        "nome": "Camiseta Casal"
      },
      {
        "key": "chinelo",
        "nome": "Chinelo de Casal"
      },
      {
        "key": "colar",
        "nome": "Colar Casal"
      },
      {
        "key": "gorro",
        "nome": "Gorro Casal"
      },
      {
        "key": "pulseira",
        "nome": "Pulseira Casal"
      }
    ]
  }
]);
})(window);
