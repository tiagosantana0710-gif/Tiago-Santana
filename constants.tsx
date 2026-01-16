
import { Prayer, Rosary } from './types';

export const PRAYERS: Prayer[] = [
  // --- ESSENCIAIS ---
  {
    id: 'pai-nosso',
    title: 'Pai Nosso',
    category: 'Essenciais',
    content: 'Pai nosso que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino, seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.',
    explanation: 'A oração que Jesus nos ensinou. É o modelo perfeito de oração.',
    latinVersion: 'Pater noster, qui es in caelis, sanctificetur nomen tuum...'
  },
  {
    id: 'ave-maria',
    title: 'Ave Maria',
    category: 'Essenciais',
    content: 'Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.',
    explanation: 'A saudação angélica à Virgem Maria, reconhecendo sua maternidade divina.',
  },
  {
    id: 'credo-apostolico',
    title: 'Credo (Símbolo dos Apóstolos)',
    category: 'Essenciais',
    content: 'Creio em Deus Pai Todo-Poderoso, Criador do céu e da terra. E em Jesus Cristo, seu único Filho, nosso Senhor, que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus; está sentado à direita de Deus Pai Todo-Poderoso, donde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo; na Santa Igreja Católica; na comunhão dos santos; na remissão dos pecados; na ressurreição da carne; na vida eterna. Amém.',
    explanation: 'Resumo de todas as verdades fundamentais da nossa fé cristã.',
  },
  
  // --- MARIANAS ---
  {
    id: 'magnificat',
    title: 'Magnificat',
    category: 'Marianas',
    content: 'A minha alma engrandece o Senhor, e o meu espírito se alegra em Deus, meu Salvador, porque olhou para a humildade de sua serva. Doravante todas as gerações me chamarão bem-aventurada, porque o Todo-Poderoso fez em mim grandes coisas. Santo é o seu nome...',
    explanation: 'O cântico de gratidão de Maria após a Anunciação.',
  },
  {
    id: 'memorare',
    title: 'Lembrai-vos (Memorare)',
    category: 'Marianas',
    content: 'Lembrai-vos, ó piíssima Virgem Maria, que nunca se ouviu dizer que algum daqueles que têm recorrido à vossa proteção, implorado o vosso auxílio, e reclamado o vosso socorro, fosse por Vós desamparado. Animado eu, pois, de igual confiança, a Vós, Virgem entre todas especial, como à Mãe recorro, de Vós me valho e, gemendo sob o peso dos meus pecados, me prostro a vossos pés. Não desprezeis as minhas súplicas, ó Mãe do Filho de Deus humanado, mas dignai-vos de as ouvir propícia e de me alcançar o que vos rogo. Amém.',
    explanation: 'Atribuída a São Bernardo, é uma das orações mais confiantes à Virgem.',
  },
  {
    id: 'salve-rainha',
    title: 'Salve Rainha',
    category: 'Marianas',
    content: 'Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas...',
    explanation: 'Súplica tradicional rezada ao final do Terço.',
  },

  // --- EUCARÍSTICAS E ADORAÇÃO ---
  {
    id: 'anima-christi',
    title: 'Alma de Cristo (Anima Christi)',
    category: 'Eucarísticas',
    content: 'Alma de Cristo, santificai-me. Corpo de Cristo, salvai-me. Sangue de Cristo, inebriai-me. Água do lado de Cristo, lavai-me. Paixão de Cristo, confortai-me. Ó bom Jesus, ouvi-me. Dentro das vossas chagas, escondei-me. Não permitais que me separe de Vós. Do espírito maligno, defendei-me. Na hora da minha morte, chamai-me. E mandai-me ir para Vós, para que com os vossos Santos Vos louve por todos os séculos dos séculos. Amém.',
    explanation: 'Oração profunda de união com Cristo, ideal para após a Comunhão.',
  },
  {
    id: 'tão-tão-sacramento',
    title: 'Tão Tão Sacramento (Tantum Ergo)',
    category: 'Eucarísticas',
    content: 'Tão Tão Sacramento, adoremos vênia dão, e a antiga lei dos tipos, dê lugar à nova ação; que a fé do suplemento, o sentido falharão. Ao Genitor e ao Gerado, louvor e júbilo também, saudação, honra e virtude e bendizer sem fim convém; e ao que de ambos procede, igual louvor e glória tem. Amém.',
    explanation: 'Hino solene para a Bênção do Santíssimo Sacramento.',
  },

  // --- PROTEÇÃO E COMBATE ESPIRITUAL ---
  {
    id: 'sao-miguel',
    title: 'São Miguel Arcanjo',
    category: 'Proteção',
    content: 'São Miguel Arcanjo, defendei-nos no combate, sede nosso refúgio contra as maldades e ciladas do demônio. Ordene-lhe Deus, instantemente o pedimos, e vós, príncipe da milícia celeste, pelo poder divino, precipitai no inferno a satanás e a todos os espíritos malignos, que andam pelo mundo para perder as almas. Amém.',
    explanation: 'Oração composta pelo Papa Leão XIII para a proteção da Igreja.',
  },
  {
    id: 'sao-bento',
    title: 'Oração de São Bento',
    category: 'Proteção',
    content: 'A Cruz Sagrada seja a minha luz, não seja o dragão o meu guia. Retira-te, satanás! Nunca me aconselhes coisas vãs. É mau o que tu me ofereces, bebe tu mesmo o teu veneno! Amém.',
    explanation: 'Poderosa oração de exorcismo e proteção contida na medalha de São Bento.',
  },

  // --- ESPÍRITO SANTO ---
  {
    id: 'veni-creator',
    title: 'Vinde Espírito Criador (Veni Creator Spiritus)',
    category: 'Espírito Santo',
    content: 'Vinde Espírito Criador, as nossas almas visitai, enchei de graça celestial os corações que criastes. Sois chamado o Intercessor, do Deus excelso dom sem par, a fonte viva, o fogo, o amor, a unção espiritual...',
    explanation: 'Hino de invocação solene ao Espírito Santo.',
  },
  {
    id: 'vinde-espirito-santo',
    title: 'Vinde Espírito Santo',
    category: 'Espírito Santo',
    content: 'Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor. Enviai o vosso Espírito e tudo será criado. E renovareis a face da terra. Oremos: Ó Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, fazei que apreciemos retamente todas as coisas segundo o mesmo Espírito e gozemos sempre da sua consolção. Por Cristo Senhor Nosso. Amém.',
    explanation: 'Invocação clássica para pedir luz e sabedoria antes de qualquer atividade.',
  },

  // --- FAMILIARES ---
  {
    id: 'oracao-pelos-filhos',
    title: 'Oração pelos Filhos',
    category: 'Familiares',
    content: 'Senhor, abençoai meus filhos. Protegei-os de todos os perigos e livrai-os de todo o mal. Dai-lhes saúde, inteligência e um coração cheio de amor e fé. Que eles cresçam em sabedoria e graça diante de Deus e dos homens. Amém.',
    explanation: 'Uma súplica sincera dos pais para pedir proteção e guia espiritual para seus filhos.',
  },

  // --- SANTOS ---
  {
    id: 'sao-francisco',
    title: 'Oração da Paz (São Francisco)',
    category: 'Santos',
    content: 'Senhor, fazei-me instrumento de vossa paz. Onde houver ódio, que eu leve o amor; Onde houver ofensa, que eu leve o perdão; Onde houver discórdia, que eu leve a união; Onde houver dúvida, que eu leve a fé; Onde houver erro, que eu leve a verdade...',
    explanation: 'Oração de humildade e entrega ao serviço do próximo.',
  },
  {
    id: 'santa-teresinha',
    title: 'Oração de Santa Teresinha',
    category: 'Santos',
    content: 'Santa Teresinha do Menino Jesus, que passais o vosso Céu fazendo o bem na terra, derramai sobre mim uma chuva de rosas de bênçãos e graças, para que meu coração se inflame no amor de Jesus. Amém.',
    explanation: 'Súplica à pequena via de santidade de Santa Teresinha.',
  },
  {
    id: 'padre-pio-confianca',
    title: 'Oração de Abandono (Padre Pio)',
    category: 'Padre Pio',
    content: 'Senhor, meu Deus, em Vós deposito toda a minha confiança. Vós sois o meu único socorro e a minha única esperança. Não permitais que eu seja confundido, mas fazei que eu espere sempre em Vós...',
    explanation: 'Reflete o espírito de total entrega de São Padre Pio.',
  }
];

export const ROSARIES: Rosary[] = [
  {
    id: 'mariano',
    title: 'Santo Terço',
    description: 'A meditação da vida de Cristo pelos olhos de Maria Santíssima.',
    image: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=1200', // Statue of Virgin Mary
    steps: [
      { title: 'Sinal da Cruz', description: 'Iniciamos invocando a Santíssima Trindade.', prayer: 'Pelo sinal da Santa Cruz, livrai-nos Deus Nosso Senhor, de nossos inimigos.' },
      { title: 'Credo', description: 'Profissão de nossa Fé Católica.', prayer: 'Creio em Deus Pai Todo-Poderoso...' },
      { title: 'Pai Nosso e Ave Marias', description: 'Pelas intenções do Papa e pelas virtudes da Fé, Esperança e Caridade.', prayer: '1 Pai Nosso e 3 Ave Marias.' },
      { title: 'Dezenas', description: 'Meditação dos Mistérios (Gozosos, Luminosos, Dolorosos ou Gloriosos).', prayer: 'Anunciar o mistério, 1 Pai Nosso, 10 Ave Marias, Glória e Jaculatória.' }
    ]
  },
  {
    id: 'misericordia',
    title: 'Terço da Misericórdia',
    description: 'Ditado por Jesus a Santa Faustina para pedir piedade ao mundo.',
    image: 'https://images.unsplash.com/photo-1594632128711-209805567709?auto=format&fit=crop&q=80&w=1200', // Sacred Heart Jesus
    steps: [
      { title: 'Início', description: 'Rezar o Pai Nosso, Ave Maria e o Credo.', prayer: 'Pai Nosso... Ave Maria... Creio em Deus Pai...' },
      { title: 'Nas contas grandes', description: 'Oferecimento do Sacrifício Redentor.', prayer: 'Eterno Pai, eu Vos ofereço o Corpo e o Sangue, a Alma e a Divindade de Vosso diletíssimo Filho, Nosso Senhor Jesus Cristo, em expiação dos nossos pecados e dos do mundo inteiro.' },
      { title: 'Nas contas pequenas', description: 'Clamor pela misericórdia de Cristo.', prayer: 'Pela Sua dolorosa Paixão, tende misericórdia de nós e do mundo inteiro.' },
      { title: 'Finalização', description: 'Invocação ao Deus Santo (3 vezes).', prayer: 'Santo Deus, Santo Forte, Santo Imortal, tende piedade de nós e do mundo inteiro.' }
    ]
  },
  {
    id: 'nossa-senhora-das-dores',
    title: 'Terço de N. Sra. das Dores',
    description: 'Meditação das sete dores de Maria Santíssima em união com Jesus.',
    image: 'https://images.unsplash.com/photo-1561561021-3e4757c9f801?auto=format&fit=crop&q=80&w=1200', // Classical Statue
    steps: [
      { title: 'Início', description: 'Sinal da Cruz e intenção.', prayer: 'Nós vos louvamos, Virgem das Dores, pela vossa fidelidade ao pé da Cruz.' },
      { title: 'As Sete Dores', description: 'Meditar cada dor separadamente.', prayer: 'Para cada uma das 7 dores: 1 Pai Nosso e 7 Ave Marias.' },
      { title: 'As Dores Meditadas', description: '1. A profecia de Simeão; 2. A fuga para o Egito; 3. A perda de Jesus no Templo; 4. O encontro com Jesus no caminho do Calvário; 5. A morte de Jesus na Cruz; 6. Maria recebe Jesus em seus braços; 7. O sepultamento de Jesus.' },
      { title: 'Finalização', description: 'Oração pelas lágrimas de Maria.', prayer: 'Rogai por nós, Virgem Dolorosíssima, para que sejamos dignos das promessas de Cristo.' }
    ]
  },
  {
    id: 'sao-miguel',
    title: 'Terço de São Miguel',
    description: 'Também conhecido como Coroa Angélica, para pedir a proteção dos nove coros de anjos.',
    image: 'https://images.unsplash.com/photo-1605367500003-9e900994f134?auto=format&fit=crop&q=80&w=1200', // Angel statue
    steps: [
      { title: 'Início', description: 'Vinde, ó Deus, em meu auxílio.', prayer: 'Senhor, apressai-vos em socorrer-me. Glória ao Pai...' },
      { title: 'Nove Saudações', description: 'Uma para cada coro de anjos (Serafins, Querubins, Tronos, Dominações, Potestades, Virtudes, Principados, Arcanjos e Anjos).', prayer: 'Para cada saudação: 1 Pai Nosso e 3 Ave Marias.' },
      { title: 'Finalização', description: 'Quatro Pai Nossos em honra aos Arcanjos Miguel, Gabriel, Rafael e ao Anjo da Guarda.', prayer: 'Seguido pela oração final: Ó glorioso príncipe São Miguel...' }
    ]
  },
  {
    id: 'sagrada-familia',
    title: 'Terço da Sagrada Família',
    description: 'Oração de consagração e súplica pela santidade e proteção de todos os lares cristãos.',
    image: 'https://images.unsplash.com/photo-1543165365-072e2ed0d45a?auto=format&fit=crop&q=80&w=1200', // Church Sacred Art
    steps: [
      { title: 'Início', description: 'Sinal da Cruz, Credo, Pai Nosso e 3 Ave Marias.', prayer: 'Invocamos a Sagrada Família de Nazaré sobre nossa casa.' },
      { title: 'Nas contas grandes', description: 'Invocação de pertença.', prayer: 'Sagrada Família de Nazaré: Jesus, Maria e José, minha família vossa é!' },
      { title: 'Nas contas pequenas', description: 'Súplica por bênção.', prayer: 'Jesus, Maria e José, abençoai a nossa família!' },
      { title: 'Finalização', description: 'Salve Rainha e Oração à Sagrada Família.', prayer: 'Jesus, Maria e José, em vós nossa família descansa. Amém.' }
    ]
  },
  {
    id: 'divina-providencia',
    title: 'Terço da Divina Providência',
    description: 'Entrega total das necessidades ao Coração de Jesus.',
    image: 'https://images.unsplash.com/photo-1548625361-195fe61a55c3?auto=format&fit=crop&q=80&w=1200', // St Peter's Dome
    steps: [
      { title: 'Início', description: 'Invocação ao auxílio divino.', prayer: 'Vinde, ó Deus, em meu auxílio. Senhor, apressai-Vos em socorrer-me. Glória ao Pai...' },
      { title: 'Nas contas grandes', description: 'Ato de confiança.', prayer: 'Providência Santíssima do Coração de Jesus, providenciai!' },
      { title: 'Nas contas pequenas', description: 'Súplica contínua.', prayer: 'Deus providencia, Deus providenciará, Sua misericórdia não faltará!' }
    ]
  }
];

export const getLiturgicalColorInfo = (color: string) => {
  switch (color) {
    case 'green': return { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', label: 'Tempo Comum' };
    case 'purple': return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', label: 'Quaresma/Advento' };
    case 'white': return { bg: 'bg-stone-50', text: 'text-amber-900', border: 'border-amber-200', label: 'Festas e Solenidades' };
    case 'red': return { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200', label: 'Paixão e Mártires' };
    default: return { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200', label: 'Especial' };
  }
};
