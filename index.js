import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// 1. Creación de tipos de objetos (Schema GraphQL)
const typeDefs = `#graphql
  type Materia {
    id: ID!
    nombre: String!
    descripcion: String #
    resumenes: [Resumen!]!
    videos: [Video!]
    bibliografia: [Bibliografia!]
    visualizaciones: Int # atributo que mantendrá el contador de las veces que e visualice y seleccióne esa materia
  }
   
  type Resumen {
    id: ID!
    titulo: String!
    pdfUrl: String!
  }

  type Video {
    id: ID!
    titulo: String!
    url: String!
  }

  type Bibliografia {
    id: ID!
    titulo: String!
    autor: String!
    editorial: String!
  }

  type Query {
    materias: [Materia!]!
    materiaPorId(id: ID!): Materia
  }
    
  # Recibe el ID de la materia, le suma 1 en la base de datos y devuelve la materia actualizada, todo esto con la mutation que está especificada en la linea 367
    
  type Mutation {
  registrarVisualizacion(materiaId: ID!): Materia!
}
`;

// 2. Datos en Memoria 
const materias = [
  { 
    id: "BDD1",
    nombre: "Base de Datos 1",
    descripcion: "Introducción al diseño, modelado y consultas de bases de datos relacionales.",
    resumenes: ["R03", "R04"],
    videos: ["V07", "V08", "V09", "V10", "V11", "V12", "V13"],
    bibliografia: ["B08", "B09", "B10", "B11", "B12", "B13"]
  },
  {
    id: "AC1",
    nombre: "Arquitectura de Computadoras 1",
    descripcion: "Introducción a los principios de diseño y arquitectura de sistemas computacionales.",
    resumenes: ["R05", "R06"],
    videos: ["V21", "V22", "V23", "V24", "V25", "V26", "V27", "V28", "V29"],
    bibliografia: ["B14", "B15", "B16"]
  },
  {
    id: "REDES1",
    nombre: "Comunicación y Redes 1",
    descripcion: "Introducción, interconexiones físicas y principios de comunicación y redes de computadoras.",
    resumenes: ["R01", "R02"],
    videos: ["V01", "V02", "V03", "V04", "V05", "V06"],
    bibliografia: ["B17", "B18"]
  },
  {
    id: "ING1",
    nombre: "Ingeniería de Software 1",
    descripcion: "Introducción a los principios y prácticas en el ciclo de vida de desarrollo de software",
    resumenes: ["R11", "R12"],
    videos: ["V36", "V37", "V38", "V39", "V40", "V41", "V42"],
    bibliografia: ["B01", "B02", "B03"]
  },
  {
    id: "AC2",
    nombre: "Arquitectura de Computadoras 2",
    descripcion: "Profundización en temas avanzados de arquitectura de computadoras, como ciclos de captación, buses, interrupciones y ALU.",
    resumenes: ["R07", "R08"],
    videos: ["V30", "V31", "V32", "V33", "V34", "V35"],
    bibliografia: ["B19", "B20"]
  },
  {
    id: "SO1",
    nombre: "Sistemas Operativos 1",
    descripcion:"Principios de sistemas operativos, gestión de procesos, memoria y archivos.",
    resumenes: ["R09", "R10"],
    videos: ["V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21"],
    bibliografia: ["B21", "B22"]
  },
  {
    id: "PROB",
    nombre: "Problemática regional",
    descripcion: "Identifiación del espacio urbano, Análisis de problemas sociales y económicos en contextos regionales.",
    resumenes: ["R13", "R14"],
    videos: ["V43", "V44", "V45"],
    bibliografia: ["B04", "B05", "B06", "B07", "B08"]
  },
  {
    id: "APD",
    nombre: "Análisis y producción del discurso",
    descripcion: "Análisis de textos, recursos linguisticos y desarrollo de habilidades de comunicación académica y profesional.",
    resumenes: ["R15", "R16"],
    videos: ["V46", "V47", "V48"],
    bibliografia: []
  },
  {
    id: "REDES2",
    nombre: "Comunicación y Redes 2",
    descripcion: "Profundización en temas avanzados de comunicación y redes, como protocolos, Modelo OSI seguridad y administración de redes.",
    resumenes: ["R09", "R10"],
    videos: ["V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21"],
    bibliografia: ["B21", "B22"]
},
{
    id: "ING2",
    nombre: "Ingeniería de Software 2",
    descripcion: "Profundización en temas avanzados de ingeniería de software, desarrollo enfocado en la primer etapa INGENIERÍA DE REQUISITOS",
    resumenes: ["R09", "R10"],
    videos: ["V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21"],
    bibliografia: ["B21", "B22"]
},
{
    id: "DISCRETA",
    nombre: "Matemática Discreta",
    descripcion: "Introducción a los conceptos fundamentales de la matemática discreta, incluyendo lógica, teoría de conjuntos, combinatoria y grafos.",
    resumenes: ["R09", "R10"],
    videos: ["V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21"],
    bibliografia: ["B21", "B22"]
},
{
    id: "ALGEBRA",
    nombre: "Álgebra",
    descripcion: "Introducción a los conceptos fundamentales del álgebra Y Geometría analítica, incluyendo estructuras algebraicas, ecuaciones, sistemas de ecuaciones, matrices,vectores y cónicas.",
    resumenes: ["R09", "R10"],
    videos: ["V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21"],
    bibliografia: ["B21", "B22"]
},
{
    id: "LF",
    nombre: "Lenguajes Formales",
    descripcion: "Introducción a los conceptos fundamentales de los lenguajes formales, incluyendo gramáticas, autómatas, expresiones regulares, máquina de Turing y teoría de la compilación.",
    resumenes: ["R09", "R10"],
    videos: ["V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21"],
    bibliografia: ["B21", "B22"]
},
{
    id: "ALGORITMOS",
    nombre: "Algoritmos",
    descripcion: "Introducción a los conceptos fundamentales de los algoritmos, incluyendo complejidad, diseño y análisis, estructuras, flujo y programación estructurada de datos.",
    resumenes: ["R09", "R10"],
    videos: ["V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21"],
    bibliografia: ["B21", "B22"]
},
{
    id: "TA",
    nombre: "Tecnología Aplicada",
    descripcion: "Introducción a los principios y prácticas en el desarrollo de tecnologías aplicadas, conceptos básicos electricos.",
    resumenes: ["R09", "R10"],
    videos: ["V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21"],
    bibliografia: ["B21", "B22"]
},
{
    id: "POO1",
    nombre: "Programación con Objetos 1",
    descripcion: "Introducción a los conceptos fundamentales de la programación orientada a objetos, incluyendo encapsulamiento, herencia y polimorfismo.",
    resumenes: ["R09", "R10"],
    videos: ["V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21"],
    bibliografia: ["B21", "B22"]
},
{
    id: "POO2",
    nombre: "Programación con Objetos 2",
    descripcion: "Profundización en los conceptos de programación orientada a objetos, incluyendo diseño de clases, patrones de diseño y buenas prácticas, algoritmos de recorridos, casos de prueba, complejidad y  pensamiento computacional .",
    resumenes: ["R09", "R10"],
    videos: ["V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21"],
    bibliografia: ["B21", "B22"]
},
{
    id: "UCYS",
    nombre: "UCYS",
    descripcion: "Introducción a los conceptos fundamentales de la cultura y sociedad, incluyendo historia, sociología, antropología, filosofía y ética, influyente sobre las universidades y la sociedad en general.",
    resumenes: ["R09", "R10"],
    videos: ["V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21"],
    bibliografia: ["B21", "B22"]
},
{
    id: "AM1",
    nombre: "Análisis Matemático 1",
    descripcion: "Introducción a los conceptos fundamentales del análisis matemático, incluyendo límites, continuidad, derivadas e integrales de funciones de una variable en el plano.",
    resumenes: ["R09", "R10"],
    videos: ["V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21"],
    bibliografia: ["B21", "B22"]
},
{
    id: "AM2",
    nombre: "Análisis Matemático 2",
    descripcion: "Profundización en los conceptos del análisis matemático, incluyendo limites y tipos de derivadas de doble variable, integrales múltiples, series de Taylor, ecuaciones diferenciales y transformadas en el espacio",
    resumenes: ["R09", "R10"],
    videos: ["V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21"],
    bibliografia: ["B21", "B22"]
},
{
    id: "BDD2",
    nombre: "Base de Datos 2",
    descripcion: "Profundización en los conceptos de bases de datos, incluyendo diseño avanzado, optimización de consultas, ocurrencias, transacciones, ACID  y seguridad.",
    resumenes: ["R09", "R10"],
    videos: ["V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21"],
    bibliografia: ["B21", "B22"]
}
];
//urls a drive
const resumenes = [
  { id: "R01", titulo: "Parte 1", pdfUrl: "https://drive.google.com/file/d/1O2PoqmJoVZc_2llUDsJH8XdXoJ6vTrX8/view?usp=drive_link" },
  { id: "R02", titulo: "Parte 2", pdfUrl: "https://drive.google.com/file/d/1fv2-M_vL9lRBS1-EQmuwhdnSlDtmfHD2/view?usp=drive_link" },
  { id: "R03", titulo: "Parte 1", pdfUrl: "https://drive.google.com/file/d/1H9suioMZMMxVxzEua8VEUxx7gQWhOG_h/view?usp=drive_link" },
  { id: "R04", titulo: "Parte 2", pdfUrl: "https://drive.google.com/file/d/1cmHWgNQMerV8TDv5cwsOPQA67rNtYBe-/view?usp=drive_link" },
  { id: "R05", titulo: "Parte 1", pdfUrl: "https://drive.google.com/file/d/1Ecramee6XHe5tEwgzmFrWi2X9bEr_DfP/view?usp=drive_link" },
  { id: "R06", titulo: "Parte 2", pdfUrl: "https://drive.google.com/file/d/1h9djK6cHWa7wQlh5tqw6M3TTa6tQ4gt6/view?usp=drive_link" },  //arqui1
  { id: "R07", titulo: "Parte 1", pdfUrl: "https://drive.google.com/file/d/14bUuiQIzdXPKmMcWo_5-J5FnaeOFLDCA/view?usp=drive_link" },
  { id: "R08", titulo: "Parte 2", pdfUrl: "https://drive.google.com/file/d/1Xe8n_RRMuf2HRuJbOokq7TAmk-0VX5pJ/view?usp=drive_link" },
  { id: "R09", titulo: "Parte 1", pdfUrl: "https://drive.google.com/file/d/15ie-kXk7FlPLEoCmrVFrV0aMhX98cIpu/view?usp=drive_link" },
  { id: "R10", titulo: "Parte 2", pdfUrl: "https://drive.google.com/file/d/1ir2wqPAERLZUDMpuXJ_1M3K7iC3V0OWL/view?usp=drive_link" },
  { id: "R11", titulo: "Parte 1", pdfUrl: "https://drive.google.com/file/d/1rizXkeYPf-tkTo5X1XCSKHJW4o7qTTuN/view?usp=drive_link" },
  { id: "R12", titulo: "Parte 2", pdfUrl: "https://drive.google.com/file/d/1sqoG0IQEDa43KGYChX5-K_u1apMjUa40/view?usp=drive_link" }, //ing
  { id: "R13", titulo: "Parte 1", pdfUrl: "https://drive.google.com/file/d/1GxIMgzxCb_iWGtN3ez3R47gQGFPCSvhB/view?usp=drive_link" },
  { id: "R14", titulo: "Parte 2", pdfUrl: "https://drive.google.com/file/d/1xYtli6J5begPurRUyWH7RE158k10nfCD/view?usp=drive_link" },
   { id: "R15", titulo: "Parte 1", pdfUrl: "https://drive.google.com/file/d/1zjKkxVzA_f-KB3HN8ItMAJkKVOi2MADb/view?usp=drive_link" },
{ id: "R16", titulo: "Parte 2", pdfUrl: "https://drive.google.com/file/d/1pdRTekOoe8WKbyKx2Ihu9GNZkomW5eS_/view?usp=drive_link" },

  
  
];
//sección videoss
const VideosRedes = [
  { id: "V01", titulo: "Medios de Transmisión 1", url: "https://youtu.be/V17j6i8p_J4?si=d5vWlBIZETGmUs4G" },
  { id: "V02", titulo: "Medios de Transmisión 2", url: "https://youtu.be/0WJ5zVzc3ZM?si=Gf4Tceg_u5Hhh_XP" },
  { id: "V03", titulo: "Topologías de Red", url: "https://youtu.be/oy_vnFR-nzI?si=lEq00_FyAZxBjiux" },
  { id: "V04", titulo: "Modelo OSI", url: "https://youtu.be/CnNRdJgeMo8?si=WBvo1ga-qtAlTOet" },
  { id: "V05", titulo: "tipos de redes", url: "https://youtu.be/l6brkMOJCIo?si=8XTOhpEVuxSUwRpo" },
  { id: "V06", titulo: "Corrección de errores", url: "https://youtu.be/Wj5ZLtBJ3j8?si=PIoq05xn26Lw83-G" }
];

const VideosBDD1 = [
  { id: "V07", titulo: "Diseños de base de datos", url: "https://youtu.be/m49huH2NHJ8?si=qvOJpw3s7SlLI_P7" },
  { id: "V08", titulo: "Algebra Relacional", url: "https://youtu.be/vh0KMMsTGQ0?si=m2ZKneS3JEmdDz7s" },
  { id: "V09", titulo: "Introducción al diagrama entidad-Relación", url: "https://youtu.be/6fcNDvQYZk0?si=cLHPdQndRms_mSMV" },
  { id: "V10", titulo: "Introducción al Modelo relacional", url: "https://youtu.be/AOh59KtqrtM?si=7-1BYqnbQs9pl1V_" },
  { id: "V11", titulo: "Creación de Tablas en SQL", url: "https://youtu.be/yLoh2sSDECw?si=OOWV-m0Kc-ss-sru" },
  { id: "V12", titulo: "Group by y Order by", url: "https://youtu.be/eVzmJv2B2wk?si=EG88ow04RUulPGee" },
  { id: "V13", titulo: "Comandos básicos en SQL", url: "https://youtu.be/D8-PZ7k4VYI?si=Ug85SYBPPom_wD0v" }
];

const VideosSO1 = [
  { id: "V14", titulo: "Introducción a sistemas Operativos", url: "https://youtu.be/fsuroRYmagw?si=NFHs2FMw4luW5CWC" },
  { id: "V15", titulo: "Procesos", url: "https://youtu.be/6P9PQpYb_jk?si=FjIbeqULwq3XFbP-" },
  { id: "V16", titulo: "Llamadas al sistema “calls”", url: "https://youtu.be/tffvKcs83jE?si=kjjGuooZo0tIGWtE" },
  { id: "V17", titulo: "Threads", url: "https://youtu.be/JMoM9AliF5E?si=yfTrDQ_wjRbPwwym" },
  { id: "V18", titulo: "Administración de memoria", url: "https://youtu.be/et5SCRxqMjM?si=NMM2V_NZeJQX9vID" },
  { id: "V19", titulo: "Paginación", url: "https://youtu.be/4R_GcQ_R0tE?si=PakfAGKN8-KdcgbX" },
  { id: "V20", titulo: "DeadLocks “abrazo de la muerte”", url: "https://youtu.be/JhYPWmh2dWE?si=ZqDGi_ZkIBZvXIaE" },
  { id: "V21", titulo: "Curso de SO - Algoritmos útiles", url: "https://youtube.com/playlist?list=PLBTcJetyW9aI-109oRxRjQAVy_UwGBWwq&si=sspsxR8yK_yrH8m6" }
];

const VideosAC1 = [
  { id: "V21", titulo: "Mapas de karnaugh", url: "https://youtu.be/6PRitrviFFM" },
  { id: "V22", titulo: "Flip Flops", url: "https://youtu.be/jHbiMWhGPzw?si=-b_bcSBp2vITeZH9" },
  { id: "V23", titulo: "compuertas lógicas", url: "https://youtu.be/0TslVzWCIZs?si=r_WzmRLeqJJkJHU3" },
  { id: "V24", titulo: " Jerarquía de memorias", url: "https://youtu.be/3eg1ChDL2MU?si=BdbSoE8eo6J87JKv" },
  { id: "V25", titulo: "Ciclo de instrucción básico", url: "https://youtu.be/_eUYql5ZcuU?si=4rnh7jVJ6lIUdLy4" },
  { id: "V26", titulo: "Von Neumann vs Harvard", url: "https://youtu.be/uPNgjj2a3xE?si=UWsQ-eufsb-hS8D-" },
  { id: "V27", titulo: "Organización", url: "https://youtu.be/Laz2jhik9KE?si=OcXLH5kGe9saVTH0" },
  { id: "V28", titulo: "Introducción", url: "https://youtu.be/Mzuc7Js5YUc?si=sV-O5EJxBS_iALkt" },
  { id: "V29", titulo: "Instrucción básica", url: "https://youtu.be/FtzdL81PgrQ?si=Wa3pjvnxEVQLVqtt" }
];

const VideosAC2 = [
  { id: "V30", titulo: "Introducción", url: "https://youtu.be/-URf73z9tKY?si=o2BLyX6njUjh7AW7" },
  { id: "V31", titulo: "Buses", url: "https://youtu.be/Usy2aY02UaY?si=jUasJUHamaKnw4ph" },
  { id: "V32", titulo: "Interrupciones", url: "https://youtu.be/uOkpknItDEI?si=Fuy_DFaJDek9OcR5" },
  { id: "V33", titulo: "Interrupciones", url: "https://youtu.be/APcRnkFqEbQ?si=JgU3Hb2wiSGfiaxX" },
  { id: "V34", titulo: "ALU", url: "https://youtu.be/FdHKxY4MTW8?si=HwKkTZSXTJwYNNes" },
  { id: "V35", titulo: "Caché", url: "https://youtu.be/ZlvobYFlstM?si=cFyKCUr973z70k1p" }
];

const VideosING1 = [
  { id: "V36", titulo: "Surgimiento de la Ingeniería de software", url: "https://youtu.be/It9QfJcj5vo?si=jD71Gt-JsOHUDUKW" },
  { id: "V37", titulo: "Ciclo de vida del software", url: "https://youtu.be/QHOu7CEJR88?si=NRllhQbCkN0mstE3" },
  { id: "V38", titulo: "Scrum", url: "https://youtu.be/HhC75IonpOU?si=lU5ETgGd6_psNaWy" },
  { id: "V39", titulo: "Waterfall ó Ágiles", url: "https://youtu.be/uxlOPJC3NzY?si=LfxbvVx81SdZ1ZdY" },
  { id: "V40", titulo: "Waterfall ó Ágiles", url: "https://youtu.be/VmkE1Frimwo?si=c8JH_dTl1YZL6vMD" },
  { id: "V41", titulo: "Modelos de procesos de desarrollo", url: "https://youtu.be/uhZgYsUI2A8?si=oaf6CLAuG6gKDpaG" },
  { id: "V42", titulo: "Ética", url: "https://youtu.be/mtyS2z3l_OU?si=tei1AO4Qky28Ly3S" }
];

const VideosPROB = [
  { id: "V43", titulo: "Modelo ISI", url: "https://youtu.be/8xGH-lkW04k?si=v2mnTKDV10fEx8iK" },
  { id: "V44", titulo: "Modelo Neoliberal", url: "https://youtu.be/sa79qPlALfU?si=2mb2_0XvkhdjRGT1" },
  { id: "V45", titulo: "Modelo agroexportador", url: "https://youtu.be/Bc9e3KAecbo?si=9eXhSKRfhJJRXxR3" }
];

const VideosAPD = [
  { id: "V46", titulo: "El texto científico", url: "https://youtu.be/wimisyJjjhQ?si=OJ29OGUfEms9o22R" },
  { id: "V47", titulo: "Texto argumentativo", url: "https://youtu.be/CdrNwcg50l8?si=tPhfP0c8vShfXlnr" },
  { id: "V48", titulo: "Texto explicativo", url: "https://youtu.be/aK52RxV2XuI?si=5fgUyBg-KAcPARHj" }
  
];
//sección bibliografia
const bibliografia = [
  //ing software1
  { id: "B01", titulo: "Ingeniería del Software: Un enfoque práctico", autor: "Roger S. Pressman", editorial: "----" },
  { id: "B02", titulo: "Ingeniería del Software", autor: "Ian Sommerville", editorial: "----" },
  { id: "B03", titulo: "El proceso Unificado de desarrollo de software", autor: "Ivar Jacobson, Grady Booch, James Rumbaugh", editorial: "----" },
  //problematica regional
  { id: "B04", titulo: "Apunte del INDEC ¿Qué es el Gran Buenos Aires? 2003.", autor: "Bertoncello Rodolfo", editorial: " vol. 1, N. O, Julio, 2004" },
  { id: "B05", titulo: " Memoria Verde. Historia Ecológica de la Argentina", autor: "Brailovsky Antonio Elio, Foguelman Dina", editorial: "Ed. Sudamericana. Décima Edición 1998. " },
  { id: "B06", titulo: "La Argentina Ambiental", autor: "Diana Duràn", editorial: "----" },
  { id: "B07", titulo: "Introducción al estudio de los recursos naturales", autor: " Antonio Elio Brailovsky ", editorial: "----" },
  //base de datos 1
  { id: "B08", titulo: "Delitos ecológicos", autor: "Mauricio Héctor Libster", editorial: " 2º edición. Ed. Depalma2000. " },
  { id: "B09", titulo: "Fundamentos de Base de Datos", autor: "Silberschatz - Korth", editorial: " 5° Edición. McGraw-Hill. 2006 " },
   { id: "B10", titulo: "Sistemas de Gestión de Base de Datos", autor: "Ramakrishnan, R. - Gehrke, R", editorial: "  3° Edición. McGraw-Hill. 2002 " },
  { id: "B11", titulo: "Fundamentals of Database Systems.", autor: "Elmasri, R. - Navathe, S", editorial: "  6° Edición. Addison-Wesley. 2010." },
   { id: "B12", titulo: "Database System: The Complete Book.", autor: "2nd Ed. Prentice-Hall. 2009", editorial: " 5o Edición. McGraw-Hill. 2006" },
   { id: "B13", titulo: "Sistemas de Base de Datos", autor: "Thomas M. Connolly", editorial: "4ta Edición. Pearson Educación. 2005" },
  //arqui1
   { id: "B14", titulo: "Organización y Arquitectura de Computadoras", autor: "Stallings, William", editorial: "2006" },
   { id: "B15", titulo: "Organización y Diseño de Computadoras", autor: "Patterson, Hennessy", editorial: "1995" },
 { id: "B16", titulo: "Arquitectura de Computadoras", autor: "Parhami, Bhrooz", editorial: "2005" },
 //redes 1
  { id: "B17", titulo: "Comunicaciones : Una Introducción a las Redes Digitales de Transmisión de Datos y Señales Isócronas", autor: "Castro Lechtaler - Fusario", editorial: "1era Edición" },
 { id: "B18", titulo: "comunicación y redes", autor: "william stalling", editorial: " 2005" },
//arqui2
{ id: "B19", titulo: "Organización y Arquitectura de Computadoras ", autor: "william stalling", editorial: " 2005" },
{ id: "B20", titulo: "Principios de Arquitectura de Computadoras  ", autor: " Pearson Murdoc, Miles y Heuring, Vincent", editorial: " 2002 " },
//SO1
{ id: "B21", titulo: "Operating System Concepts.", autor: "Silberschatz, Galvin, Gagne. ", editorial: "10th Edition. Wiley" },
{ id: "B22", titulo: "Sistema Operativo LINUX.  Teoría y Práctica", autor: "Allende, Gibellini, Sánchez, Serna", editorial: "2da Ed. edUTecNe " }

];



// 3. Resolvers de GraphQL
const resolvers = {
  Query: { //tenemos 2 tipos de querys, uno que devuelve toda la lista de materias, y otra que devuelve si hay coincidencias por id
    materias: () => materias,
    materiaPorId: (_, { id }) => materias.find(m => m.id === id)
  },//en este resolvers conectamos cada atributo que debe devolver una materia con su correspondiente dato
  Materia: {
    descripcion: (materia) => materia.descripcion, 
    resumenes: (materia) => resumenes.filter(r => materia.resumenes.includes(r.id)), //filtra los url de drive que corresponden con el id actual
    videos: (materia) => { //junta todos los type videos (son grupos de url a yt) en una unica lista
    const allVideos = [VideosRedes, VideosBDD1, VideosSO1, VideosAC1, VideosAC2, VideosING1,VideosAPD, VideosPROB].flat();
    return allVideos.filter(v => materia.videos.includes(v.id));// y devuelve aquella que coincida con el id actual
    },
    bibliografia: (materia) => bibliografia.filter(b => materia.bibliografia.includes(b.id))
  },
  
 // Busca la materia en la lista global por su ID
Mutation: {
  registrarVisualizacion: (_, { materiaId }) => {
    const materia = materias.find(m => m.id === materiaId);
    if (!materia) throw new Error("Materia no encontrada");
    
    // Si el campo no existe en el objeto local, lo inicializa en 0 antes de sumar
    if (materia.visualizaciones === undefined) {
      materia.visualizaciones = 0;
    }
    
    materia.visualizaciones += 1; // Suma 1
    return materia; // Devuelve el objeto modificado
  }
} 
};

// 4. Instancia del servidor
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// 5. Configuración crítica para Despliegues en la Nube (Railway/Render)
const port = process.env.PORT || 4000; // Usa el puerto dinámico asignado por el hosting

startStandaloneServer(server, {
  listen: { port: parseInt(port) },
  // Habilitamos CORS de forma global para permitir que tu frontend consulte la API sin bloqueos
  expressMiddlewareOptions: {
    cors: {
      origin: '*', 
      credentials: true
    }
  }
}).then(({ url }) => {
  console.log(`🚀 Server ready at port ${port}`);
});