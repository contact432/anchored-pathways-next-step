/* ============================================================
   Anchored Pathways — Core Tracker (prototype)
   Data: San Jacinto College Core Curriculum, 2026-2027 catalog
         Pasadena ISD / SJC Crosswalk for Dual Credit, Rev. 10/15/23
   This tool reports published requirements. It does not advise.
   ============================================================ */

const AREAS = [{
  id: "010",
  en: "Communication",
  es: "Comunicación",
  req: 6
}, {
  id: "020",
  en: "Mathematics",
  es: "Matemáticas",
  req: 3
}, {
  id: "030",
  en: "Life and Physical Science",
  es: "Ciencias Naturales",
  req: 6
}, {
  id: "040",
  en: "Language, Philosophy and Culture",
  es: "Lenguaje, Filosofía y Cultura",
  req: 3
}, {
  id: "050",
  en: "Creative Arts",
  es: "Artes Creativas",
  req: 3
}, {
  id: "060",
  en: "American History",
  es: "Historia de Estados Unidos",
  req: 6
}, {
  id: "070",
  en: "Government / Political Science",
  es: "Gobierno / Ciencias Políticas",
  req: 6
}, {
  id: "080",
  en: "Social and Behavioral Sciences",
  es: "Ciencias Sociales y del Comportamiento",
  req: 3
}, {
  id: "090",
  en: "Component Area Option",
  es: "Opción de Área Componente",
  req: 6
}];

/* San Jacinto College approved core curriculum, all 114 courses, THECB export.
   Fields: code, English title, Spanish title, SCH, core area, UH-system flags
   where 1 = University of Houston, 2 = UH-Clear Lake, 3 = UH-Downtown.
   A flag means the course appears in that institution's own approved core. */
const SJC_RAW = [["ENGL 1301", "Composition I", "Composición I", 3, "010", "123"], ["ENGL 1302", "Composition II", "Composición II", 3, "010", "123"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "010", "2"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "020", "123"], ["MATH 1316", "Plane Trigonometry", "Trigonometría Plana", 3, "020", ""], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "020", "123"], ["MATH 1325", "Calculus for Business & Social Sciences", "Cálculo para Negocios y Ciencias Sociales", 3, "020", "12"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "020", "123"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "020", "123"], ["MATH 2318", "Linear Algebra", "Álgebra Lineal", 3, "020", ""], ["MATH 2320", "Differential Equations", "Ecuaciones Diferenciales", 3, "020", ""], ["MATH 2412", "Pre-Calculus Math", "Precálculo", 4, "020", "2"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "020", "12"], ["MATH 2414", "Calculus II", "Cálculo II", 4, "020", ""], ["ASTR 1303", "Stars and Galaxies (lecture)", "Estrellas y Galaxias", 3, "030", "2"], ["ASTR 1304", "Solar System (lecture)", "El Sistema Solar", 3, "030", "2"], ["BIOL 1306", "Biology for Science Majors I (lecture)", "Biología para Ciencias I", 3, "030", "123"], ["BIOL 1307", "Biology for Science Majors II (lecture)", "Biología para Ciencias II", 3, "030", "123"], ["BIOL 1308", "Biology for Non-Science Majors I (lecture)", "Biología General I", 3, "030", "12"], ["BIOL 1309", "Biology for Non-Science Majors II (lecture)", "Biología General II", 3, "030", "12"], ["BIOL 2301", "Anatomy & Physiology I (lecture)", "Anatomía y Fisiología I", 3, "030", "23"], ["BIOL 2302", "Anatomy & Physiology II (lecture)", "Anatomía y Fisiología II", 3, "030", "23"], ["CHEM 1305", "Introductory Chemistry I (lecture)", "Química Introductoria I", 3, "030", "123"], ["CHEM 1311", "General Chemistry I (lecture)", "Química General I", 3, "030", "123"], ["CHEM 1312", "General Chemistry II (lecture)", "Química General II", 3, "030", "123"], ["GEOL 1301", "Earth Sciences for Non-Science Majors I (lecture)", "Ciencias de la Tierra I", 3, "030", ""], ["GEOL 1303", "Physical Geology (lecture)", "Geología Física", 3, "030", "123"], ["GEOL 1304", "Historical Geology (lecture)", "Geología Histórica", 3, "030", "123"], ["PHYS 1301", "College Physics I (lecture)", "Física I", 3, "030", "123"], ["PHYS 1302", "College Physics II (lecture)", "Física II", 3, "030", "123"], ["PHYS 2325", "University Physics I (lecture)", "Física Universitaria I", 3, "030", "12"], ["PHYS 2326", "University Physics II (lecture)", "Física Universitaria II", 3, "030", "12"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "040", "3"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "040", "3"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "040", "3"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "040", "3"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "040", "3"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "040", "3"], ["ENGL 2341", "Forms of Literature", "Formas de Literatura", 3, "040", "23"], ["ENGL 2351", "Mexican American Literature", "Literatura Mexicoamericana", 3, "040", ""], ["GEOG 1302", "Human Geography", "Geografía Humana", 3, "040", ""], ["HIST 2321", "World Civilizations I", "Civilización Mundial I", 3, "040", "12"], ["HIST 2322", "World Civilizations II", "Civilización Mundial II", 3, "040", "12"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "040", "23"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "040", "123"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "040", "13"], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "050", "3"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "050", "23"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "050", "123"], ["DANC 1305", "World Dance", "Danza Mundial", 3, "050", ""], ["DANC 2303", "Dance Appreciation", "Apreciación de la Danza", 3, "050", "12"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "050", "13"], ["DRAM 2366", "Film Appreciation", "Apreciación del Cine", 3, "050", "2"], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "050", ""], ["MUSI 1307", "Music Literature", "Literatura Musical", 3, "050", "1"], ["MUSI 1310", "American Music", "Música Americana", 3, "050", ""], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "060", "123"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "060", "123"], ["HIST 2301", "Texas History", "Historia de Texas", 3, "060", "13"], ["HIST 2327", "Mexican American History I (to the United States-Mexico War Era)", "Historia Mexicoamericana I", 3, "060", "13"], ["HIST 2328", "Mexican American History II (from the United States-Mexico War Era)", "Historia Mexicoamericana II", 3, "060", "13"], ["HIST 2381", "African American History I", "Historia Afroamericana I", 3, "060", "1"], ["HIST 2382", "African American History II", "Historia Afroamericana II", 3, "060", "1"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "070", "123"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "070", "123"], ["ANTH 2302", "Introduction to Archeology", "Introducción a la Arqueología", 3, "080", "13"], ["ANTH 2346", "General Anthropology", "Antropología General", 3, "080", "1"], ["ANTH 2351", "Cultural Anthropology", "Antropología Cultural", 3, "080", "13"], ["CRIJ 1301", "Introduction to Criminal Justice", "Introducción a la Justicia Penal", 3, "080", "23"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "080", "12"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "080", "12"], ["GEOG 1303", "World Regional Geography", "Geografía Regional Mundial", 3, "080", "2"], ["GOVT 2304", "Introduction to Political Science", "Introducción a Ciencias Políticas", 3, "080", ""], ["HIST 2311", "Western Civilization I", "Civilización Occidental I", 3, "080", ""], ["HIST 2312", "Western Civilization II", "Civilización Occidental II", 3, "080", ""], ["PSYC 2301", "General Psychology", "Psicología General", 3, "080", "123"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "080", "123"], ["SOCI 2319", "Minority Studies", "Estudios de Minorías", 3, "080", ""], ["TECA 1354", "Child Growth & Development", "Crecimiento y Desarrollo Infantil", 3, "080", "2"], ["ASTR 1103", "Stars and Galaxies Laboratory (lab)", "Estrellas y Galaxias (laboratorio)", 1, "090", "2"], ["ASTR 1104", "Solar System Laboratory (lab)", "El Sistema Solar (laboratorio)", 1, "090", "2"], ["BIOL 1106", "Biology for Science Majors Laboratory I (lab)", "Biología para Ciencias I (laboratorio)", 1, "090", "2"], ["BIOL 1107", "Biology for Science Majors Laboratory II (lab)", "Biología para Ciencias II (laboratorio)", 1, "090", "2"], ["BIOL 1108", "Biology for Non-Science Majors Laboratory I (lab)", "Biología General I (laboratorio)", 1, "090", "2"], ["BIOL 1109", "Biology for Non-Science Majors Laboratory II (lab)", "Biología General II (laboratorio)", 1, "090", "2"], ["BIOL 2101", "Anatomy & Physiology I (lab)", "Anatomía y Fisiología I (laboratorio)", 1, "090", "2"], ["BIOL 2102", "Anatomy & Physiology II (lab)", "Anatomía y Fisiología II (laboratorio)", 1, "090", "2"], ["CHEM 1105", "Introductory Chemistry Laboratory I (lab)", "Química Introductoria I (laboratorio)", 1, "090", "2"], ["CHEM 1111", "General Chemistry I (lab)", "Química General I (laboratorio)", 1, "090", "2"], ["CHEM 1112", "General Chemistry II (lab)", "Química General II (laboratorio)", 1, "090", "2"], ["CHIN 1411", "Beginning Chinese I", "Chino Básico I", 4, "090", ""], ["CHIN 1412", "Beginning Chinese II", "Chino Básico II", 4, "090", ""], ["EDUC 1100", "Learning Framework (1 SCH version)", "Marco de Aprendizaje", 1, "090", ""], ["FREN 1411", "Beginning French I (1st semester French, 4 SCH version)", "Francés Básico I", 4, "090", ""], ["FREN 1412", "Beginning French II (2nd semester French, 4 SCH version)", "Francés Básico II", 4, "090", ""], ["GEOL 1101", "Earth Sciences for Non-Science Majors I (lab)", "Ciencias de la Tierra I (laboratorio)", 1, "090", ""], ["GEOL 1103", "Physical Geology  (lab)", "Geología Física (laboratorio)", 1, "090", "2"], ["GEOL 1104", "Historical Geology (lab)", "Geología Histórica (laboratorio)", 1, "090", "2"], ["GERM 1411", "Beginning German I (1st semester German, 4 SCH version)", "Alemán Básico I", 4, "090", ""], ["GERM 1412", "Beginning German II (2nd semester German, 4 SCH version)", "Alemán Básico II", 4, "090", ""], ["GOVT 2107", "Federal and Texas Constitutions", "Constituciones Federal y de Texas", 1, "090", ""], ["PHED 1164", "Introduction to Physical Fitness & Wellness", "Introducción a la Aptitud Física y Bienestar", 1, "090", ""], ["PHYS 1101", "College Physics Laboratory I (lab)", "Física I (laboratorio)", 1, "090", "2"], ["PHYS 1102", "College Physics Laboratory II (lab)", "Física II (laboratorio)", 1, "090", "2"], ["PHYS 2125", "University Physics Laboratory I (lab)", "Física Universitaria I (laboratorio)", 1, "090", "2"], ["PHYS 2126", "University Physics Laboratory II (lab)", "Física Universitaria II (laboratorio)", 1, "090", "2"], ["SGNL 1401", "Beginning American Sign Language I (1st semester ASL, 4 SCH version)", "Lenguaje de Señas I", 4, "090", ""], ["SGNL 1402", "Beginning American Sign Language II (2nd semester ASL, 4 SCH version)", "Lenguaje de Señas II", 4, "090", ""], ["SPAN 1411", "Beginning Spanish I (1st semester Spanish, 4 SCH version)", "Español Básico I", 4, "090", ""], ["SPAN 1412", "Beginning Spanish II (2nd semester Spanish, 4 SCH version)", "Español Básico II", 4, "090", ""], ["SPCH 1311", "Introduction to Speech Communication", "Introducción a la Comunicación Oral", 3, "090", "3"], ["SPCH 1315", "Public Speaking", "Oratoria", 3, "090", "23"], ["SPCH 1318", "Interpersonal Communication", "Comunicación Interpersonal", 3, "090", "3"], ["SPCH 1321", "Business & Professional Communication", "Comunicación Empresarial y Profesional", 3, "090", ""]];
const HCC_RAW = [["ENGL 1301", "Composition I", "Composición I", 3, "010", "123"], ["ENGL 1302", "Composition II", "Composición II", 3, "010", "123"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "010", "2"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "020", "123"], ["MATH 1316", "Plane Trigonometry", "Trigonometría Plana", 3, "020", ""], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "020", "123"], ["MATH 1325", "Calculus for Business & Social Sciences", "Cálculo para Negocios y Ciencias Sociales", 3, "020", "12"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "020", "123"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "020", "123"], ["MATH 1350", "Mathematics for Teachers I (Fundamentals of Mathematics I)", "", 3, "020", "2"], ["MATH 2318", "Linear Algebra", "Álgebra Lineal", 3, "020", ""], ["MATH 2320", "Differential Equations", "Ecuaciones Diferenciales", 3, "020", ""], ["MATH 2412", "Pre-Calculus Math", "Precálculo", 4, "020", "2"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "020", "12"], ["PHIL 2303", "Introduction to Formal Logic", "", 3, "020", ""], ["PSYC 2317", "Statistical Methods in Psychology", "", 3, "020", ""], ["ANTH 2301", "Physical Anthropology (lecture)", "", 3, "030", "1"], ["ASTR 1303", "Stars and Galaxies (lecture)", "Estrellas y Galaxias", 3, "030", "2"], ["ASTR 1304", "Solar System (lecture)", "El Sistema Solar", 3, "030", "2"], ["BIOL 1306", "Biology for Science Majors I (lecture)", "Biología para Ciencias I", 3, "030", "123"], ["BIOL 1308", "Biology for Non-Science Majors I (lecture)", "Biología General I", 3, "030", "12"], ["BIOL 1309", "Biology for Non-Science Majors II (lecture)", "Biología General II", 3, "030", "12"], ["BIOL 1322", "Nutrition & Diet Therapy", "", 3, "030", "23"], ["BIOL 1407", "Biology for Science Majors II (lecture + lab)", "", 4, "030", ""], ["BIOL 2301", "Anatomy & Physiology I (lecture)", "Anatomía y Fisiología I", 3, "030", "23"], ["BIOL 2302", "Anatomy & Physiology II (lecture)", "Anatomía y Fisiología II", 3, "030", "23"], ["CHEM 1305", "Introductory Chemistry I (lecture)", "Química Introductoria I", 3, "030", "123"], ["CHEM 1311", "General Chemistry I (lecture)", "Química General I", 3, "030", "123"], ["CHEM 1405", "Introductory Chemistry I (lecture + lab)", "", 4, "030", ""], ["CHEM 1412", "General Chemistry II (lecture + lab)", "", 4, "030", ""], ["GEOG 1301", "Physical Geography", "", 3, "030", ""], ["GEOL 1301", "Earth Sciences for Non-Science Majors I (lecture)", "Ciencias de la Tierra I", 3, "030", ""], ["GEOL 1305", "Environmental Science (lecture)", "", 3, "030", "3"], ["GEOL 1345", "Oceanography (lecture)", "", 3, "030", "13"], ["GEOL 1347", "Meteorology (lecture)", "", 3, "030", "1"], ["GEOL 1403", "Physical Geology (lecture + lab)", "", 4, "030", ""], ["GEOL 1404", "Historical Geology (lecture + lab)", "", 4, "030", ""], ["PHYS 1305", "Elementary Physics I (lecture)", "", 3, "030", ""], ["PHYS 1401", "College Physics I (lecture + lab)", "", 4, "030", ""], ["PHYS 1402", "College Physics II (lecture + lab)", "", 4, "030", ""], ["PHYS 2325", "University Physics I (lecture)", "Física Universitaria I", 3, "030", "12"], ["PHYS 2326", "University Physics II (lecture)", "Física Universitaria II", 3, "030", "12"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "040", "3"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "040", "3"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "040", "3"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "040", "3"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "040", "3"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "040", "3"], ["ENGL 2341", "Forms of Literature", "Formas de Literatura", 3, "040", "23"], ["ENGL 2351", "Mexican American Literature", "Literatura Mexicoamericana", 3, "040", ""], ["HIST 2311", "Western Civilization I", "Civilización Occidental I", 3, "040", "1"], ["HIST 2312", "Western Civilization II", "Civilización Occidental II", 3, "040", "1"], ["HIST 2321", "World Civilizations I", "Civilización Mundial I", 3, "040", "12"], ["HIST 2322", "World Civilizations II", "Civilización Mundial II", 3, "040", "12"], ["HUMA 1305", "Introduction to Mexican American Studies", "", 3, "040", ""], ["HUMA 2319", "American Minority Studies", "", 3, "040", ""], ["HUMA 2323", "World Cultures", "", 3, "040", ""], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "040", "123"], ["PHIL 1304", "Introduction to World Religions", "", 3, "040", ""], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "040", "13"], ["PHIL 2307", "Introduction to Social & Political Philosophy", "", 3, "040", ""], ["PHIL 2316", "Classical Philosophy", "", 3, "040", ""], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "050", "3"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "050", "23"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "050", "123"], ["ARTS 1311", "Design I   (2-dimensional)", "", 3, "050", ""], ["ARTS 1312", "Design II (3-dimensional)", "", 3, "050", ""], ["ARTS 1313", "Foundations of Art", "", 3, "050", ""], ["ARTS 1316", "Drawing I", "", 3, "050", ""], ["ARTS 2348", "Digital Media", "", 3, "050", ""], ["DANC 1305", "World Dance", "Danza Mundial", 3, "050", ""], ["DANC 2303", "Dance Appreciation", "Apreciación de la Danza", 3, "050", "12"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "050", "13"], ["DRAM 2361", "History of the Theater I", "", 3, "050", ""], ["DRAM 2366", "Film Appreciation", "Apreciación del Cine", 3, "050", "2"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "050", ""], ["HUMA 1311", "Mexican American Fine Arts Appreciation", "", 3, "050", ""], ["MUSI 1303", "Fundamentals Of Music", "", 3, "050", ""], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "050", ""], ["MUSI 1307", "Music Literature", "Literatura Musical", 3, "050", "1"], ["MUSI 1310", "American Music", "Música Americana", 3, "050", ""], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "060", "123"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "060", "123"], ["HIST 2301", "Texas History", "Historia de Texas", 3, "060", "13"], ["HIST 2327", "Mexican American History I (to the United States-Mexico War Era)", "Historia Mexicoamericana I", 3, "060", "13"], ["HIST 2328", "Mexican American History II (from the United States-Mexico War Era)", "Historia Mexicoamericana II", 3, "060", "13"], ["HIST 2381", "African American History I", "Historia Afroamericana I", 3, "060", "1"], ["HIST 2382", "African American History II", "Historia Afroamericana II", 3, "060", "1"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "070", "123"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "070", "123"], ["ANTH 2346", "General Anthropology", "Antropología General", 3, "080", "1"], ["ANTH 2351", "Cultural Anthropology", "Antropología Cultural", 3, "080", "13"], ["ECON 1301", "Introduction To Economics", "", 3, "080", ""], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "080", "12"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "080", "12"], ["GEOG 1302", "Human Geography", "Geografía Humana", 3, "080", ""], ["GEOG 1303", "World Regional Geography", "Geografía Regional Mundial", 3, "080", "2"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "080", "123"], ["PSYC 2314", "Lifespan Growth & Development", "", 3, "080", "1"], ["PSYC 2316", "Psychology of Personality", "", 3, "080", ""], ["PSYC 2319", "Social Psychology", "", 3, "080", ""], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "080", "123"], ["SOCI 1306", "Social Problems", "", 3, "080", "2"], ["SOCI 2336", "Criminology", "", 3, "080", ""], ["TECA 1354", "Child Growth & Development", "Crecimiento y Desarrollo Infantil", 3, "080", "2"], ["ANTH 2101", "Physical Anthropology (lab)", "", 1, "090", ""], ["ANTH 2302", "Introduction to Archeology", "Introducción a la Arqueología", 3, "090", ""], ["ARAB 1411", "Beginning Arabic I", "", 4, "090", ""], ["ARAB 1412", "Beginning Arabic II", "", 4, "090", ""], ["ASTR 1103", "Stars and Galaxies Laboratory (lab)", "Estrellas y Galaxias (laboratorio)", 1, "090", "2"], ["ASTR 1104", "Solar System Laboratory (lab)", "El Sistema Solar (laboratorio)", 1, "090", "2"], ["BIOL 1106", "Biology for Science Majors Laboratory I (lab)", "Biología para Ciencias I (laboratorio)", 1, "090", "2"], ["CHEM 1111", "General Chemistry I (lab)", "Química General I (laboratorio)", 1, "090", "2"], ["CHIN 1411", "Beginning Chinese I", "Chino Básico I", 4, "090", ""], ["CHIN 1412", "Beginning Chinese II", "Chino Básico II", 4, "090", ""], ["COMM 1307", "Introduction to Mass Communication", "", 3, "090", "3"], ["COMM 2311", "Media Writing", "", 3, "090", "3"], ["COSC 1436", "Programming Fundamentals I", "", 4, "090", ""], ["EDUC 1300", "Learning Framework", "", 3, "090", "3"], ["FREN 1411", "Beginning French I (1st semester French, 4 SCH version)", "Francés Básico I", 4, "090", ""], ["FREN 1412", "Beginning French II (2nd semester French, 4 SCH version)", "Francés Básico II", 4, "090", ""], ["GEOL 1105", "Environmental Science (lab)", "", 1, "090", ""], ["GERM 1411", "Beginning German I (1st semester German, 4 SCH version)", "Alemán Básico I", 4, "090", ""], ["GERM 1412", "Beginning German II (2nd semester German, 4 SCH version)", "Alemán Básico II", 4, "090", ""], ["JAPN 1411", "Beginning Japanese I (1st semester Japanese, 4 SCH version)", "", 4, "090", ""], ["JAPN 1412", "Beginning Japanese II (2nd semester Japanese, 4 SCH version)", "", 4, "090", ""], ["KORE 1411", "Beginning Korean I (1st semester Korean, 4 SCH version)", "", 4, "090", ""], ["KORE 1412", "Beginning Korean II (2nd semester Korean, 4 SCH version)", "", 4, "090", ""], ["MATH 1351", "Mathematics for Teachers II  (Fundamentals of Mathematics II)", "", 3, "090", "1"], ["MATH 2414", "Calculus II", "Cálculo II", 4, "090", "1"], ["MATH 2415", "Calculus III", "", 4, "090", ""], ["PHED 1304", "Personal/Community Health", "", 3, "090", ""], ["PHED 1306", "First Aid, CPR, and Safety Practices", "", 3, "090", ""], ["PHYS 2125", "University Physics Laboratory I (lab)", "Física Universitaria I (laboratorio)", 1, "090", "2"], ["PHYS 2126", "University Physics Laboratory II (lab)", "Física Universitaria II (laboratorio)", 1, "090", "2"], ["PSYC 2320", "Abnormal Psychology", "", 3, "090", "1"], ["PSYC 2330", "Biological Psychology", "", 3, "090", ""], ["SOCI 2301", "Marriage & the Family", "", 3, "090", ""], ["SOCI 2326", "Social Psychology", "", 3, "090", ""], ["SPAN 1411", "Beginning Spanish I (1st semester Spanish, 4 SCH version)", "Español Básico I", 4, "090", ""], ["SPAN 1412", "Beginning Spanish II (2nd semester Spanish, 4 SCH version)", "Español Básico II", 4, "090", ""], ["SPCH 1311", "Introduction to Speech Communication", "Introducción a la Comunicación Oral", 3, "090", "3"], ["SPCH 1315", "Public Speaking", "Oratoria", 3, "090", "23"], ["SPCH 1318", "Interpersonal Communication", "Comunicación Interpersonal", 3, "090", "3"], ["SPCH 1321", "Business & Professional Communication", "Comunicación Empresarial y Profesional", 3, "090", ""]];
const expand = rows => rows.map(([c, t, ts, h, a, u]) => ({
  c,
  t,
  ts: ts || t,
  h,
  a,
  u
}));
const COLLEGES = {
  sjc: {
    id: "sjc",
    en: "San Jacinto College",
    es: "San Jacinto College",
    courses: expand(SJC_RAW),
    footnotes: true
  },
  hcc: {
    id: "hcc",
    en: "Houston City College",
    es: "Houston City College",
    courses: expand(HCC_RAW),
    footnotes: false
  }
};

/* District dual credit course lists, read from each district's published
   crosswalk. Only courses that appear in the college's own approved core are
   listed here; every district also offers CTE and other courses outside the core.
   Where a crosswalk names a course the college does not carry in its core, the
   course is left out rather than substituted. */
const DISTRICTS = [{
  id: "all",
  col: "sjc",
  en: "All core courses",
  es: "Todos los cursos del core",
  src: {
    en: "San Jacinto College approved core curriculum",
    es: "Core curriculum aprobado de San Jacinto College"
  },
  courses: null
}, {
  id: "crosby",
  col: "sjc",
  en: "Crosby ISD",
  es: "Crosby ISD",
  src: {
    en: "Crosby ISD to SJC dual credit course crosswalks, updated 08/15/2025. Core courses are reached through the MECA degree plans.",
    es: "Crosswalk de Crosby ISD y SJC, actualizado el 08/15/2025. Los cursos del core se toman por medio de los planes de estudio MECA."
  },
  courses: ["SPCH 1315", "ARTS 1301", "MUSI 1310", "GOVT 2305", "GOVT 2306", "EDUC 1100", "HIST 1301", "HIST 1302", "ENGL 1301", "ENGL 1302", "HUMA 1301", "MATH 1314", "MATH 1324", "MATH 1332", "MATH 1342", "MATH 2412", "MATH 2413", "MATH 2414", "GEOL 1303", "GEOL 1103", "GEOL 1304", "GEOL 1104", "ECON 2301", "ECON 2302", "SOCI 1301", "PSYC 2301", "BIOL 1306", "BIOL 1106", "BIOL 1307", "BIOL 1107", "BIOL 2301", "BIOL 2101", "BIOL 2302", "BIOL 2102", "PHYS 1301", "PHYS 1101", "PHYS 2325", "PHYS 2125", "PHYS 2326", "PHYS 2126", "CHEM 1311", "CHEM 1111", "CHEM 1312", "CHEM 1112", "PHED 1164", "SPAN 1411", "SPAN 1412", "CRIJ 1301", "TECA 1354"]
}, {
  id: "deerpark",
  col: "sjc",
  id2: "dp",
  en: "Deer Park ISD",
  es: "Deer Park ISD",
  src: {
    en: "Dual credit course offerings, Summer/Fall 2025 and Spring 2026",
    es: "Cursos de dual credit, Verano/Otoño 2025 y Primavera 2026"
  },
  courses: ["EDUC 1100", "HUMA 1301", "PSYC 2301", "SOCI 1301", "SPCH 1315", "SPAN 1411", "SPAN 1412", "ARTS 1301", "DANC 2303", "DRAM 1310", "DRAM 2366", "MUSI 1306", "PHED 1164", "HIST 1301", "HIST 1302", "ENGL 1301", "ENGL 1302", "GOVT 2305", "ECON 2301"]
}, {
  id: "faithchristian",
  col: "sjc",
  en: "Faith Christian Academy",
  es: "Faith Christian Academy",
  src: {
    en: "FCA high school course requirements, grades 9 through 12, with San Jacinto Central dual credit courses",
    es: "Requisitos de cursos de FCA, grados 9 a 12, con cursos de dual credit de San Jacinto Central"
  },
  courses: ["ENGL 2322", "ENGL 2327", "ENGL 2332", "MATH 1314", "MATH 2412", "MATH 2413", "BIOL 1306", "BIOL 1106", "BIOL 1308", "BIOL 1108", "CHEM 1305", "CHEM 1105", "BIOL 2301", "BIOL 2101", "PHYS 1301", "PHYS 1101", "ANTH 2351", "HIST 1301", "HIST 1302", "GOVT 2305", "ECON 2301", "ECON 2302", "SPAN 1411", "SPAN 1412", "CHIN 1411", "CHIN 1412", "FREN 1411", "FREN 1412", "SGNL 1401", "SGNL 1402", "SPCH 1311", "PSYC 2301", "ARTS 1301", "DANC 1305", "MUSI 1306", "SOCI 1301"]
}, {
  id: "galenapark",
  col: "sjc",
  en: "Galena Park ISD",
  es: "Galena Park ISD",
  partial: true,
  src: {
    en: "Crosswalk, partial. Only the physical education, language, and fine arts sections were available.",
    es: "Crosswalk, parcial. Solo estaban disponibles las secciones de educación física, idiomas y bellas artes."
  },
  courses: ["PHED 1164", "SPAN 1411", "SPAN 1412", "SGNL 1401", "SGNL 1402", "ARTS 1301", "ARTS 1303", "ARTS 1304", "MUSI 1306", "MUSI 1310"]
}, {
  id: "hallsville",
  col: "sjc",
  en: "Hallsville ISD",
  es: "Hallsville ISD",
  src: {
    en: "San Jacinto College dual credit crosswalk, general version. Hallsville ISD uses the college's standard crosswalk rather than a district specific one.",
    es: "Crosswalk general de dual credit de San Jacinto College. Hallsville ISD usa el crosswalk estándar del colegio y no uno propio del distrito."
  },
  courses: ["ENGL 1301", "ENGL 1302", "MATH 1314", "BIOL 2301", "BIOL 2302", "CHEM 1311", "PHYS 2325", "PHYS 2326", "ENGL 2322", "ARTS 1301", "DRAM 1310", "MUSI 1306", "HIST 1301", "HIST 1302", "GOVT 2305", "GOVT 2306", "ANTH 2351", "ECON 2301", "ECON 2302", "GEOG 1303", "PSYC 2301", "SOCI 1301", "SPCH 1321", "SPCH 1311", "SPCH 1315"]
}, {
  id: "houstonisd",
  col: "sjc",
  en: "Houston ISD and Texas Connections Academy",
  es: "Houston ISD y Texas Connections Academy",
  src: {
    en: "HISD dual credit crosswalk, San Jacinto College column. Most courses carry a TSI readiness requirement and many need HISD faculty syllabus approval.",
    es: "Crosswalk de dual credit de HISD, columna de San Jacinto College. La mayoría de los cursos requiere preparación TSI y muchos necesitan aprobación del plan de estudios por el profesorado de HISD."
  },
  courses: ["ENGL 1301", "ENGL 1302", "ENGL 2311", "ENGL 2322", "ENGL 2323", "ENGL 2327", "ENGL 2328", "ENGL 2332", "ENGL 2333", "HUMA 1301", "SPCH 1311", "SPCH 1315", "SPCH 1318", "SPCH 1321", "MATH 1314", "MATH 1316", "MATH 1324", "MATH 1325", "MATH 1332", "MATH 1342", "MATH 2412", "MATH 2413", "MATH 2414", "BIOL 1306", "BIOL 1106", "BIOL 1307", "BIOL 1107", "BIOL 1308", "BIOL 1108", "BIOL 1309", "BIOL 1109", "BIOL 2301", "BIOL 2101", "BIOL 2302", "BIOL 2102", "CHEM 1305", "CHEM 1105", "CHEM 1311", "CHEM 1111", "CHEM 1312", "CHEM 1112", "GEOL 1301", "GEOL 1303", "GEOL 1103", "GEOL 1304", "GEOL 1104", "PHYS 1301", "PHYS 1101", "PHYS 1302", "PHYS 1102", "PHYS 2325", "PHYS 2125", "PHYS 2326", "PHYS 2126", "ANTH 2302", "ANTH 2346", "ANTH 2351", "ECON 2301", "ECON 2302", "GEOG 1303", "GOVT 2304", "GOVT 2305", "GOVT 2306", "HIST 1301", "HIST 1302", "HIST 2311", "HIST 2327", "HIST 2328", "HIST 2381", "HIST 2382", "PHIL 1301", "PHIL 2306", "PSYC 2301", "SOCI 1301", "ARTS 1301", "ARTS 1303", "DANC 1305", "DRAM 1310", "MUSI 1306", "MUSI 1307", "MUSI 1310", "SPAN 1411", "SPAN 1412", "FREN 1411", "FREN 1412", "SGNL 1401", "SGNL 1402", "CHIN 1411", "CHIN 1412", "GERM 1411", "GERM 1412", "EDUC 1100"]
}, {
  id: "huntsville",
  col: "sjc",
  en: "Huntsville ISD (TOPS)",
  es: "Huntsville ISD (TOPS)",
  src: {
    en: "San Jacinto College dual credit crosswalk, general version. Huntsville TOPS uses the college's standard crosswalk rather than a district specific one.",
    es: "Crosswalk general de dual credit de San Jacinto College. Huntsville TOPS usa el crosswalk estándar del colegio y no uno propio del distrito."
  },
  courses: ["ENGL 1301", "ENGL 1302", "MATH 1314", "BIOL 2301", "BIOL 2302", "CHEM 1311", "PHYS 2325", "PHYS 2326", "ENGL 2322", "ARTS 1301", "DRAM 1310", "MUSI 1306", "HIST 1301", "HIST 1302", "GOVT 2305", "GOVT 2306", "ANTH 2351", "ECON 2301", "ECON 2302", "GEOG 1303", "PSYC 2301", "SOCI 1301", "SPCH 1321", "SPCH 1311", "SPCH 1315"]
}, {
  id: "laporte",
  col: "sjc",
  en: "La Porte ISD",
  es: "La Porte ISD",
  src: {
    en: "La Porte ISD ACE course options and on campus dual enrollment. The published list pairs labs with some sciences and not others.",
    es: "Opciones de cursos ACE de La Porte ISD y dual enrollment en el plantel. La lista publicada incluye laboratorio en algunas ciencias y en otras no."
  },
  courses: ["ENGL 1301", "ENGL 1302", "ENGL 2322", "ENGL 2327", "HUMA 1301", "MATH 1314", "MATH 1324", "MATH 1325", "MATH 1342", "MATH 2412", "MATH 2413", "BIOL 1306", "BIOL 1307", "BIOL 1308", "BIOL 1309", "BIOL 2301", "BIOL 2101", "BIOL 2302", "BIOL 2102", "CHEM 1311", "CHEM 1111", "CHEM 1312", "CHEM 1112", "GEOL 1303", "GEOL 1103", "GEOL 1304", "GEOL 1104", "PHYS 1301", "PHYS 1101", "PHYS 1302", "PHYS 1102", "PHYS 2325", "PHYS 2125", "PHYS 2326", "PHYS 2126", "ECON 2301", "GOVT 2305", "GOVT 2306", "HIST 1301", "HIST 1302", "EDUC 1100", "PSYC 2301", "SOCI 1301", "SPAN 1411", "SPAN 1412", "FREN 1411", "FREN 1412", "ARTS 1301", "ARTS 1304", "DRAM 2366", "SPCH 1315", "SPCH 1318"]
}, {
  id: "pasadena",
  col: "sjc",
  en: "Pasadena ISD",
  es: "Pasadena ISD",
  src: {
    en: "Crosswalk dated 10/15/23",
    es: "Crosswalk con fecha 10/15/23"
  },
  courses: ["ENGL 1301", "ENGL 1302", "MATH 2412", "BIOL 2301", "HUMA 1301", "PHIL 1301", "ARTS 1301", "MUSI 1310", "DRAM 1310", "DRAM 2366", "HIST 1301", "HIST 1302", "HIST 2327", "HIST 2328", "GOVT 2305", "GOVT 2306", "ECON 2301", "ECON 2302", "PSYC 2301", "SOCI 1301", "SPCH 1315"]
}, {
  id: "hccall",
  col: "hcc",
  en: "All core courses",
  es: "Todos los cursos del core",
  src: {
    en: "Houston City College approved core curriculum",
    es: "Core curriculum aprobado de Houston City College"
  },
  courses: null
}, {
  id: "hcchoustonisd",
  col: "hcc",
  en: "Houston ISD and Texas Connections Academy",
  es: "Houston ISD y Texas Connections Academy",
  src: {
    en: "HISD dual credit crosswalk, Houston City College column. Most courses carry a TSI readiness requirement and many need HISD faculty syllabus approval.",
    es: "Crosswalk de dual credit de HISD, columna de Houston City College. La mayoría de los cursos requiere preparación TSI y muchos necesitan aprobación del plan de estudios por el profesorado de HISD."
  },
  courses: ["ENGL 1301", "ENGL 1302", "ENGL 2311", "ENGL 2322", "ENGL 2323", "ENGL 2327", "ENGL 2328", "ENGL 2332", "ENGL 2333", "HUMA 1301", "SPCH 1311", "SPCH 1315", "SPCH 1318", "SPCH 1321", "MATH 1314", "MATH 1316", "MATH 1324", "MATH 1325", "MATH 1332", "MATH 1342", "MATH 2412", "MATH 2413", "MATH 2414", "BIOL 1306", "BIOL 1106", "BIOL 1308", "BIOL 1309", "BIOL 1407", "BIOL 2301", "BIOL 2302", "BIOL 1322", "CHEM 1305", "CHEM 1311", "CHEM 1111", "CHEM 1412", "GEOL 1301", "GEOL 1403", "GEOL 1404", "PHYS 1401", "PHYS 1402", "PHYS 2325", "PHYS 2326", "ANTH 2302", "ANTH 2346", "ANTH 2351", "ECON 2301", "ECON 2302", "GEOG 1303", "GOVT 2305", "GOVT 2306", "HIST 1301", "HIST 1302", "HIST 2311", "HIST 2327", "HIST 2328", "HIST 2381", "HIST 2382", "PHIL 1301", "PHIL 2306", "PSYC 2301", "PSYC 2314", "SOCI 1301", "SOCI 1306", "ARTS 1301", "ARTS 1303", "DANC 1305", "DRAM 1310", "MUSI 1306", "MUSI 1307", "MUSI 1310", "SPAN 1411", "SPAN 1412", "FREN 1411", "FREN 1412", "CHIN 1411", "CHIN 1412", "GERM 1411", "GERM 1412", "TECA 1354", "COSC 1436", "EDUC 1300"]
}];
const UH_LABEL = {
  "1": "UH",
  "2": "UH-Clear Lake",
  "3": "UH-Downtown"
};

/* San Jacinto College catalog footnotes, quoted as published. */
const FOOTNOTE = {
  "MATH 1324": "mathSci",
  "MATH 1325": "mathSci",
  "MATH 1332": "mathSci",
  "BIOL 1308": "notSci",
  "BIOL 1309": "notSci",
  "CHEM 1305": "notSci",
  "GEOL 1301": "notSci",
  "BIOL 2301": "allied",
  "BIOL 2302": "allied"
};
const NEEDS_LAB = new Set("ASTR 1303,ASTR 1304,BIOL 1306,BIOL 1307,BIOL 1308,BIOL 1309,BIOL 2301,BIOL 2302,CHEM 1305,CHEM 1311,CHEM 1312,GEOL 1301,GEOL 1303,GEOL 1304,PHYS 1301,PHYS 1302,PHYS 2325,PHYS 2326".split(","));
const FOUR_HOUR_MATH = new Set(["MATH 2412", "MATH 2413", "MATH 2414"]);
const T = {
  en: {
    kicker: "Anchored Pathways",
    title: "Core Tracker",
    sub: "Texas protects a completed 42-hour core as a block. This shows how close your student is, using the courses your district publishes.",
    district: "San Jacinto College core curriculum",
    marked: "hours marked",
    of: "of 42",
    filled: "Requirement filled",
    remaining: "hours still needed",
    beyond: "hours beyond this requirement",
    flows: "Extra hours here can count toward the Component Area Option, up to 6 hours.",
    shortList: "The courses currently shown for this area total fewer hours than this area requires.",
    partialNote: "This district list is incomplete. Only part of the crosswalk was available, so areas may show fewer courses than the district actually offers.",
    uhHead: "Appears in the approved core at",
    uhNone: "Not in the approved core at UH, UH-Clear Lake, or UH-Downtown.",
    uhNote: "These tags show whether a course is listed in that university's own approved core curriculum. They do not tell you whether a course will transfer or count toward a major. Ask each university.",
    unabsorbed: "hours not counted toward any area. Each area has a limit, and the Component Area Option is full at 6 hours.",
    pastCore: "hours beyond the 42-hour core.",
    gapTitle: "Something to ask about",
    gapBody: "EDUC 1100 Learning Framework is required in the San Jacinto College core, and it is not on this district's crosswalk. Ask your counselor how a dual credit student completes the full 42 hours.",
    allied: "The catalog notes this course is designed for allied health majors and not for academic transfer as a science major.",
    notSci: "The catalog notes this course does not meet the requirements for science majors.",
    mathSci: "The catalog notes this course does not meet the requirements for students pursuing mathematics or science.",
    labNote: "The catalog notes students must be co-enrolled in the co-requisite science lab. Labs are listed under the Component Area Option.",
    mathOverflow: "This is a 4 hour course. The catalog notes the overflow hour may be accounted for in the Component Area Option or in the Transfer Path.",
    doneTitle: "All 42 hours marked",
    doneBody: "Under Texas law, a completed core transfers as a block and the receiving university substitutes it for its own core.",
    reset: "Clear all",
    ask: "Questions worth asking",
    q1: "Which core area does this course fill, and have we already filled it?",
    q2: "Does the college my student wants to attend have a Field of Study for their major?",
    q3: "Do we qualify for FAST?",
    foot: "Core curriculum data from the Texas Higher Education Coordinating Board approved core curricula export. District course lists read from each district's published crosswalk. Requirements change. Confirm with your counselor and the college.",
    disclaim: "This tool reports published requirements. It does not recommend courses or predict what any college will accept.",
    tagline: ""
  },
  es: {
    kicker: "Anchored Pathways",
    title: "Rastreador del Core",
    sub: "Texas protege un core completo de 42 horas como bloque. Esto muestra qué tan cerca está su estudiante, usando los cursos que publica su distrito.",
    district: "Core curriculum de San Jacinto College",
    marked: "horas marcadas",
    of: "de 42",
    filled: "Requisito cumplido",
    remaining: "horas que faltan",
    beyond: "horas más allá de este requisito",
    flows: "Las horas extra aquí pueden contar para la Opción de Área Componente, hasta 6 horas.",
    shortList: "Los cursos que se muestran actualmente para esta área suman menos horas de las que requiere esta área.",
    partialNote: "Esta lista del distrito está incompleta. Solo estaba disponible una parte del crosswalk, así que algunas áreas pueden mostrar menos cursos de los que el distrito realmente ofrece.",
    uhHead: "Aparece en el core aprobado de",
    uhNone: "No está en el core aprobado de UH, UH-Clear Lake ni UH-Downtown.",
    uhNote: "Estas etiquetas muestran si un curso aparece en el core aprobado de esa universidad. No indican si el curso se transferirá ni si contará para una carrera. Pregunte en cada universidad.",
    unabsorbed: "horas que no cuentan para ninguna área. Cada área tiene un límite, y la Opción de Área Componente se llena a las 6 horas.",
    pastCore: "horas más allá del core de 42 horas.",
    gapTitle: "Algo que preguntar",
    gapBody: "EDUC 1100 Learning Framework es requerido en el core de San Jacinto College, y no está en el crosswalk de este distrito. Pregunte a su consejero cómo un estudiante de dual credit completa las 42 horas.",
    allied: "El catálogo indica que este curso está diseñado para carreras de salud aliada y no para transferencia académica como especialidad en ciencias.",
    notSci: "El catálogo indica que este curso no cumple los requisitos para especialidades en ciencias.",
    mathSci: "El catálogo indica que este curso no cumple los requisitos para estudiantes que siguen matemáticas o ciencias.",
    labNote: "El catálogo indica que el estudiante debe inscribirse al mismo tiempo en el laboratorio correspondiente. Los laboratorios están en la Opción de Área Componente.",
    mathOverflow: "Este curso es de 4 horas. El catálogo indica que la hora sobrante puede contarse en la Opción de Área Componente o en el Transfer Path.",
    doneTitle: "Las 42 horas están marcadas",
    doneBody: "Bajo la ley de Texas, un core completo se transfiere como bloque y la universidad receptora lo sustituye por el suyo.",
    reset: "Borrar todo",
    ask: "Preguntas que vale la pena hacer",
    q1: "¿Cuál requisito del core cumple este curso, y ya lo cumplimos?",
    q2: "¿La universidad que quiere mi estudiante tiene un Field of Study para su carrera?",
    q3: "¿Calificamos para FAST?",
    foot: "Datos del core curriculum del export de core curricula aprobados de la Texas Higher Education Coordinating Board. Listas de cursos por distrito tomadas del crosswalk publicado de cada distrito. Los requisitos cambian. Confirme con su consejero y con el colegio.",
    disclaim: "Esta herramienta reporta requisitos publicados. No recomienda cursos ni predice lo que aceptará una universidad.",
    tagline: "Porque nadie debería recorrer el camino solo."
  }
};
function CoreTracker() {
  const [lang, setLang] = useState("en");
  const [picked, setPicked] = useState({});
  const [collegeId, setCollegeId] = useState("sjc");
  const [districtId, setDistrictId] = useState("pasadena");
  const t = T[lang];
  const toggle = code => setPicked(p => ({
    ...p,
    [code]: !p[code]
  }));
  const college = COLLEGES[collegeId];
  const options = DISTRICTS.filter(d => d.col === collegeId);
  const district = options.find(d => d.id === districtId) || options[0];
  const visible = useMemo(() => {
    if (!district.courses) return college.courses;
    const s = new Set(district.courses);
    return college.courses.filter(c => s.has(c.c));
  }, [district, college]);
  const grouped = AREAS.map(a => ({
    area: a,
    list: visible.filter(c => c.a === a.id)
  }));
  const maxByArea = useMemo(() => {
    const m = {};
    AREAS.forEach(a => m[a.id] = 0);
    visible.forEach(c => m[c.a] += c.h);
    return m;
  }, [visible]);
  const calc = useMemo(() => {
    const byArea = {};
    AREAS.forEach(a => byArea[a.id] = {
      raw: 0,
      counted: 0,
      over: 0
    });
    visible.forEach(c => {
      if (picked[c.c]) byArea[c.a].raw += c.h;
    });
    AREAS.forEach(a => {
      if (a.id === "090") return;
      byArea[a.id].counted = Math.min(byArea[a.id].raw, a.req);
      byArea[a.id].over = Math.max(0, byArea[a.id].raw - a.req);
    });
    const spill = AREAS.filter(a => a.id !== "090").reduce((s, a) => s + byArea[a.id].over, 0);
    const cao = byArea["090"];
    const caoTotal = cao.raw + spill;
    cao.counted = Math.min(caoTotal, 6);
    cao.over = Math.max(0, caoTotal - 6);
    const total = AREAS.reduce((s, a) => s + byArea[a.id].counted, 0);
    return {
      byArea,
      total,
      spill,
      past: cao.over
    };
  }, [picked, visible]);
  return /*#__PURE__*/React.createElement("div", {
    style: S.page
  }, /*#__PURE__*/React.createElement("style", null, CSS), /*#__PURE__*/React.createElement("header", {
    style: S.head
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: S.kicker
  }, t.kicker), /*#__PURE__*/React.createElement("h1", {
    style: S.h1
  }, t.title)), /*#__PURE__*/React.createElement("button", {
    style: S.lang,
    onClick: () => setLang(lang === "en" ? "es" : "en")
  }, lang === "en" ? "Español" : "English")), /*#__PURE__*/React.createElement("p", {
    style: S.sub
  }, t.sub), /*#__PURE__*/React.createElement("div", {
    style: S.district
  }, lang === "en" ? college.en : college.es), /*#__PURE__*/React.createElement("div", {
    style: S.collegeRow
  }, Object.values(COLLEGES).map(cl => /*#__PURE__*/React.createElement("button", {
    key: cl.id,
    style: {
      ...S.colBtn,
      ...(cl.id === collegeId ? S.colOn : {})
    },
    onClick: () => {
      setCollegeId(cl.id);
      setDistrictId(DISTRICTS.find(d => d.col === cl.id).id);
      setPicked({});
    }
  }, lang === "en" ? cl.en : cl.es))), /*#__PURE__*/React.createElement("div", {
    style: S.viewRow
  }, options.map(d => /*#__PURE__*/React.createElement("button", {
    key: d.id,
    style: {
      ...S.viewBtn,
      ...(d.id === districtId ? S.viewOn : {})
    },
    onClick: () => {
      setDistrictId(d.id);
      setPicked({});
    }
  }, lang === "en" ? d.en : d.es))), /*#__PURE__*/React.createElement("div", {
    style: S.srcLine
  }, lang === "en" ? district.src.en : district.src.es), district.partial && /*#__PURE__*/React.createElement("div", {
    style: S.partial
  }, t.partialNote), /*#__PURE__*/React.createElement("div", {
    style: S.uhNote
  }, t.uhNote), /*#__PURE__*/React.createElement("section", {
    style: S.blockWrap,
    "aria-label": `${calc.total} ${t.of}`
  }, /*#__PURE__*/React.createElement("div", {
    style: S.blockNums
  }, /*#__PURE__*/React.createElement("span", {
    style: S.bigNum
  }, calc.total), /*#__PURE__*/React.createElement("span", {
    style: S.smallNum
  }, t.of, " ", t.marked)), /*#__PURE__*/React.createElement("div", {
    style: S.bars
  }, AREAS.map(a => {
    const d = calc.byArea[a.id];
    const done = d.counted >= a.req;
    return /*#__PURE__*/React.createElement("div", {
      key: a.id,
      style: {
        ...S.barCol,
        flex: a.req
      },
      title: lang === "en" ? a.en : a.es
    }, /*#__PURE__*/React.createElement("div", {
      style: S.barTrack
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...S.barFill,
        height: `${d.counted / a.req * 100}%`,
        background: done ? "#1A5F6E" : "#7FB3BD"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: S.barLabel
    }, a.id));
  })), calc.total >= 42 && /*#__PURE__*/React.createElement("div", {
    style: S.done
  }, /*#__PURE__*/React.createElement("strong", null, t.doneTitle), /*#__PURE__*/React.createElement("div", {
    style: S.doneBody
  }, t.doneBody)), calc.past > 0 && calc.total < 42 && /*#__PURE__*/React.createElement("div", {
    style: S.pastNote
  }, calc.past, " ", t.unabsorbed), calc.past > 0 && calc.total >= 42 && /*#__PURE__*/React.createElement("div", {
    style: S.pastNote
  }, calc.past, " ", t.pastCore)), grouped.map(({
    area,
    list
  }) => {
    const d = calc.byArea[area.id];
    const done = d.counted >= area.req;
    return /*#__PURE__*/React.createElement("section", {
      key: area.id,
      style: S.area
    }, /*#__PURE__*/React.createElement("div", {
      style: S.areaHead
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: S.areaId
    }, area.id), /*#__PURE__*/React.createElement("span", {
      style: S.areaName
    }, lang === "en" ? area.en : area.es)), /*#__PURE__*/React.createElement("div", {
      style: {
        ...S.areaHours,
        color: done ? "#1A5F6E" : "#5b6b70"
      }
    }, d.counted, "/", area.req)), /*#__PURE__*/React.createElement("div", {
      style: S.status
    }, done ? /*#__PURE__*/React.createElement("span", {
      style: S.ok
    }, t.filled) : /*#__PURE__*/React.createElement("span", {
      style: S.need
    }, area.req - d.counted, " ", t.remaining), d.over > 0 && area.id !== "090" && /*#__PURE__*/React.createElement("span", {
      style: S.over
    }, d.over, " ", t.beyond)), area.id !== "090" && maxByArea[area.id] < area.req && /*#__PURE__*/React.createElement("div", {
      style: S.flows
    }, t.shortList), d.over > 0 && area.id !== "090" && /*#__PURE__*/React.createElement("div", {
      style: S.flows
    }, t.flows), /*#__PURE__*/React.createElement("div", {
      style: S.list
    }, list.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: S.empty
    }, "\u2014"), list.map(c => /*#__PURE__*/React.createElement(React.Fragment, {
      key: c.c
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        ...S.row,
        ...(picked[c.c] ? S.rowOn : {})
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: !!picked[c.c],
      onChange: () => toggle(c.c),
      style: S.cb
    }), /*#__PURE__*/React.createElement("span", {
      style: S.code
    }, c.c), /*#__PURE__*/React.createElement("span", {
      style: S.name
    }, lang === "en" ? c.t : c.ts), /*#__PURE__*/React.createElement("span", {
      style: S.hrs
    }, c.h)), c.u && /*#__PURE__*/React.createElement("div", {
      style: S.uhTags
    }, ["1", "2", "3"].map(k => /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        ...S.tagPill,
        ...(c.u.includes(k) ? S.tagOn : S.tagOff)
      }
    }, UH_LABEL[k]))), college.footnotes && FOOTNOTE[c.c] && /*#__PURE__*/React.createElement("div", {
      style: S.inlineNote
    }, t[FOOTNOTE[c.c]]), college.footnotes && NEEDS_LAB.has(c.c) && /*#__PURE__*/React.createElement("div", {
      style: S.inlineNote
    }, t.labNote), college.footnotes && FOUR_HOUR_MATH.has(c.c) && /*#__PURE__*/React.createElement("div", {
      style: S.inlineNote
    }, t.mathOverflow)))), area.id === "090" && collegeId === "sjc" && district.courses && !district.courses.includes("EDUC 1100") && /*#__PURE__*/React.createElement("div", {
      style: S.gap
    }, /*#__PURE__*/React.createElement("strong", null, t.gapTitle), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6
      }
    }, t.gapBody)));
  }), /*#__PURE__*/React.createElement("section", {
    style: S.ask
  }, /*#__PURE__*/React.createElement("h2", {
    style: S.h2
  }, t.ask), /*#__PURE__*/React.createElement("ol", {
    style: S.qs
  }, /*#__PURE__*/React.createElement("li", null, t.q1), /*#__PURE__*/React.createElement("li", null, t.q2), /*#__PURE__*/React.createElement("li", null, t.q3))), /*#__PURE__*/React.createElement("button", {
    style: S.reset,
    onClick: () => setPicked({})
  }, t.reset), /*#__PURE__*/React.createElement("footer", {
    style: S.foot
  }, /*#__PURE__*/React.createElement("div", null, t.disclaim), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      opacity: 0.75
    }
  }, t.foot), t.tagline && /*#__PURE__*/React.createElement("div", {
    style: S.tag
  }, t.tagline)));
}
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600&display=swap');
* { box-sizing: border-box; }
input[type=checkbox] { accent-color: #1A5F6E; }
label:focus-within { outline: 2px solid #F5A623; outline-offset: 2px; }
button:focus-visible { outline: 2px solid #F5A623; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;
const S = {
  page: {
    fontFamily: "'Work Sans', system-ui, sans-serif",
    maxWidth: 720,
    margin: "0 auto",
    padding: "28px 20px 60px",
    background: "#fff",
    color: "#14505E"
  },
  head: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12
  },
  kicker: {
    fontSize: 11,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#E8832A",
    fontWeight: 600
  },
  h1: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 40,
    lineHeight: 1.05,
    margin: "6px 0 0",
    fontWeight: 600,
    color: "#14505E"
  },
  lang: {
    background: "none",
    border: "1px solid #1A5F6E",
    color: "#1A5F6E",
    borderRadius: 999,
    padding: "7px 15px",
    fontSize: 13,
    fontFamily: "inherit",
    cursor: "pointer",
    whiteSpace: "nowrap"
  },
  sub: {
    fontSize: 16,
    lineHeight: 1.55,
    marginTop: 18,
    color: "#2c5a63"
  },
  district: {
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#7a8b90",
    marginTop: 14,
    paddingBottom: 18,
    borderBottom: "1px solid #e2ebed"
  },
  blockWrap: {
    margin: "26px 0 34px"
  },
  blockNums: {
    display: "flex",
    alignItems: "baseline",
    gap: 10
  },
  bigNum: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 60,
    fontWeight: 700,
    lineHeight: 1,
    color: "#1A5F6E"
  },
  smallNum: {
    fontSize: 14,
    color: "#5b6b70"
  },
  bars: {
    display: "flex",
    gap: 4,
    height: 92,
    marginTop: 16,
    alignItems: "flex-end"
  },
  barCol: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  barTrack: {
    flex: 1,
    background: "#eef4f5",
    borderRadius: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    overflow: "hidden"
  },
  barFill: {
    width: "100%",
    borderRadius: 3,
    transition: "height .25s ease"
  },
  barLabel: {
    fontSize: 9,
    textAlign: "center",
    marginTop: 5,
    color: "#9aa8ac",
    letterSpacing: ".04em"
  },
  done: {
    marginTop: 18,
    padding: "14px 16px",
    background: "#1A5F6E",
    color: "#fff",
    borderRadius: 6,
    fontSize: 14
  },
  doneBody: {
    marginTop: 5,
    opacity: 0.92,
    lineHeight: 1.5
  },
  pastNote: {
    marginTop: 12,
    fontSize: 13,
    color: "#B4661F",
    background: "#FDF4E7",
    padding: "9px 12px",
    borderRadius: 5
  },
  area: {
    padding: "20px 0",
    borderTop: "1px solid #e2ebed"
  },
  areaHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 10
  },
  areaId: {
    fontSize: 11,
    color: "#9aa8ac",
    marginRight: 9,
    letterSpacing: ".08em"
  },
  areaName: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 19,
    fontWeight: 600
  },
  areaHours: {
    fontSize: 15,
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums"
  },
  status: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 9
  },
  ok: {
    fontSize: 12,
    color: "#1A5F6E",
    background: "#e8f2f3",
    padding: "4px 10px",
    borderRadius: 999
  },
  need: {
    fontSize: 12,
    color: "#5b6b70",
    background: "#f2f6f7",
    padding: "4px 10px",
    borderRadius: 999
  },
  over: {
    fontSize: 12,
    color: "#B4661F",
    background: "#FDF4E7",
    padding: "4px 10px",
    borderRadius: 999
  },
  flows: {
    fontSize: 12.5,
    color: "#7a8b90",
    marginTop: 9,
    lineHeight: 1.5
  },
  list: {
    marginTop: 13,
    display: "flex",
    flexDirection: "column",
    gap: 2
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "10px 12px",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14.5
  },
  rowOn: {
    background: "#f4f9fa"
  },
  cb: {
    width: 17,
    height: 17,
    flexShrink: 0,
    cursor: "pointer"
  },
  code: {
    fontWeight: 600,
    minWidth: 88,
    fontSize: 13.5,
    letterSpacing: ".01em"
  },
  name: {
    flex: 1,
    color: "#3d6068"
  },
  hrs: {
    color: "#9aa8ac",
    fontSize: 13,
    fontVariantNumeric: "tabular-nums"
  },
  empty: {
    color: "#c3d0d3",
    padding: "8px 12px"
  },
  viewRow: {
    display: "flex",
    gap: 8,
    marginTop: 16,
    flexWrap: "wrap"
  },
  viewBtn: {
    background: "none",
    border: "1px solid #cfdde0",
    color: "#5b6b70",
    borderRadius: 999,
    padding: "7px 14px",
    fontSize: 12.5,
    fontFamily: "inherit",
    cursor: "pointer"
  },
  viewOn: {
    background: "#1A5F6E",
    borderColor: "#1A5F6E",
    color: "#fff"
  },
  collegeRow: {
    display: "flex",
    gap: 8,
    marginTop: 18,
    flexWrap: "wrap"
  },
  colBtn: {
    background: "none",
    border: "1px solid #1A5F6E",
    color: "#1A5F6E",
    borderRadius: 5,
    padding: "9px 16px",
    fontSize: 13.5,
    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer"
  },
  colOn: {
    background: "#1A5F6E",
    color: "#fff"
  },
  srcLine: {
    fontSize: 11.5,
    color: "#9aa8ac",
    marginTop: 10,
    letterSpacing: ".01em"
  },
  partial: {
    fontSize: 12.5,
    lineHeight: 1.55,
    color: "#B4661F",
    background: "#FDF4E7",
    padding: "10px 12px",
    borderRadius: 5,
    marginTop: 10
  },
  uhNote: {
    fontSize: 12.5,
    lineHeight: 1.55,
    color: "#7a8b90",
    marginTop: 12
  },
  uhTags: {
    display: "flex",
    gap: 5,
    padding: "0 12px 10px 40px",
    flexWrap: "wrap"
  },
  tagPill: {
    fontSize: 10.5,
    padding: "2px 7px",
    borderRadius: 3,
    letterSpacing: ".02em",
    whiteSpace: "nowrap"
  },
  tagOn: {
    background: "#e8f2f3",
    color: "#1A5F6E"
  },
  tagOff: {
    background: "#f6f8f8",
    color: "#c3d0d3",
    textDecoration: "line-through"
  },
  inlineNote: {
    fontSize: 12.5,
    lineHeight: 1.5,
    color: "#7a8b90",
    padding: "2px 12px 10px 40px"
  },
  gap: {
    marginTop: 15,
    fontSize: 13.5,
    lineHeight: 1.55,
    background: "#FFF9EE",
    border: "1px solid #F5A623",
    padding: "13px 15px",
    borderRadius: 5,
    color: "#14505E"
  },
  ask: {
    marginTop: 34,
    paddingTop: 26,
    borderTop: "1px solid #e2ebed"
  },
  h2: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 21,
    fontWeight: 600,
    margin: 0
  },
  qs: {
    paddingLeft: 20,
    marginTop: 12,
    lineHeight: 1.75,
    fontSize: 15,
    color: "#2c5a63"
  },
  reset: {
    marginTop: 26,
    background: "none",
    border: "1px solid #cfdde0",
    color: "#5b6b70",
    borderRadius: 999,
    padding: "9px 18px",
    fontSize: 13,
    fontFamily: "inherit",
    cursor: "pointer"
  },
  foot: {
    marginTop: 34,
    paddingTop: 20,
    borderTop: "1px solid #e2ebed",
    fontSize: 12.5,
    lineHeight: 1.6,
    color: "#7a8b90"
  },
  tag: {
    marginTop: 16,
    fontFamily: "'Fraunces', Georgia, serif",
    fontStyle: "italic",
    color: "#1A5F6E",
    fontSize: 14
  }
};
