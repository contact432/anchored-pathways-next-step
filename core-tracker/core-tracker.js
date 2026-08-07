
/* ============================================================
   Anchored Pathways — Core Tracker v5

   WHAT CHANGED FROM v4
   - District and high school crosswalks removed. The tool now tracks
     against a college's own published core curriculum, which is the
     only list that determines whether the 42-hour core transfers.
   - Dual credit is handled as a question the family asks, not as a
     data filter. See DUAL_CREDIT copy in the T block.
   - Marks persist in localStorage, keyed per college.
   - Areas collapse. Touch targets meet 44px. Contrast meets WCAG AA.
   - Every state ends with a next step, not a policy statement.

   HOW TO ADD A COLLEGE
   Run build_registry.py against the THECB core curricula export rather
   than editing this file by hand. It emits the RAW arrays, REGIONS, and
   COLLEGES block below. The row shape is:
      [code, English title, Spanish title, hours, area id]
   Set type to "university" on any institution that should also appear as
   a transfer comparison for colleges in its region.
   Nothing else needs to change. The picker, the math, and the print
   view all read from the registry.

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

/* Course rows, THECB approved core curricula export.
   Fields: code, English title, Spanish title, SCH, core area, transfer flags
   where 1 = University of Houston, 2 = UH-Clear Lake, 3 = UH-Downtown.
   A flag means the course appears in that university's own approved core. */
/* Some catalogs list a course under both a named area and the Component
   Area Option, because it can count in either one. Marks are keyed by
   course code, so keeping both rows would count one course twice and let
   a student reach 42 hours on 36 real ones. Each course is kept once,
   under its named area, and flagged dual. Allocation is handled by the
   spill rule below: a named area fills first, and hours beyond what it
   requires move to the Component Area Option. Filling named areas first
   is always at least as good as any other split, because a course only
   spills once its named area is already full. */
const expand = rows => {
  const at = {};
  const out = [];
  rows.forEach(([c, t, ts, h, a]) => {
    const row = {
      c,
      t,
      ts: ts || t,
      h,
      a,
      dual: false
    };
    const i = at[c];
    if (i === undefined) {
      at[c] = out.length;
      out.push(row);
    } else {
      out[i].dual = true;
      if (out[i].a === "090" && a !== "090") {
        out[i] = {
          ...row,
          dual: true
        };
      }
    }
  });
  return out;
};

/* Regions order the picker. Add new regions here as colleges are added. */

const SJC_RAW = [["ENGL 1301", "Composition I", "Composición I", 3, "010"], ["ENGL 1302", "Composition II", "Composición II", 3, "010"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "010"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "020"], ["MATH 1316", "Plane Trigonometry", "Trigonometría Plana", 3, "020"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1325", "Calculus for Business & Social Sciences", "Cálculo para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "020"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "020"], ["MATH 2318", "Linear Algebra", "Álgebra Lineal", 3, "020"], ["MATH 2320", "Differential Equations", "Ecuaciones Diferenciales", 3, "020"], ["MATH 2412", "Pre-Calculus Math", "Precálculo", 4, "020"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "020"], ["MATH 2414", "Calculus II", "Cálculo II", 4, "020"], ["ASTR 1303", "Stars and Galaxies (lecture)", "Estrellas y Galaxias", 3, "030"], ["ASTR 1304", "Solar System (lecture)", "El Sistema Solar", 3, "030"], ["BIOL 1306", "Biology for Science Majors I (lecture)", "Biología para Ciencias I", 3, "030"], ["BIOL 1307", "Biology for Science Majors II (lecture)", "Biología para Ciencias II", 3, "030"], ["BIOL 1308", "Biology for Non-Science Majors I (lecture)", "Biología General I", 3, "030"], ["BIOL 1309", "Biology for Non-Science Majors II (lecture)", "Biología General II", 3, "030"], ["BIOL 2301", "Anatomy & Physiology I (lecture)", "Anatomía y Fisiología I", 3, "030"], ["BIOL 2302", "Anatomy & Physiology II (lecture)", "Anatomía y Fisiología II", 3, "030"], ["CHEM 1305", "Introductory Chemistry I (lecture)", "Química Introductoria I", 3, "030"], ["CHEM 1311", "General Chemistry I (lecture)", "Química General I", 3, "030"], ["CHEM 1312", "General Chemistry II (lecture)", "Química General II", 3, "030"], ["GEOL 1301", "Earth Sciences for Non-Science Majors I (lecture)", "Ciencias de la Tierra I", 3, "030"], ["GEOL 1303", "Physical Geology (lecture)", "Geología Física", 3, "030"], ["GEOL 1304", "Historical Geology (lecture)", "Geología Histórica", 3, "030"], ["PHYS 1301", "College Physics I (lecture)", "Física I", 3, "030"], ["PHYS 1302", "College Physics II (lecture)", "Física II", 3, "030"], ["PHYS 2325", "University Physics I (lecture)", "Física Universitaria I", 3, "030"], ["PHYS 2326", "University Physics II (lecture)", "Física Universitaria II", 3, "030"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "040"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "040"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "040"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "040"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "040"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "040"], ["ENGL 2341", "Forms of Literature", "Formas de Literatura", 3, "040"], ["ENGL 2351", "Mexican American Literature", "Literatura Mexicoamericana", 3, "040"], ["GEOG 1302", "Human Geography", "Geografía Humana", 3, "040"], ["HIST 2321", "World Civilizations I", "Civilización Mundial I", 3, "040"], ["HIST 2322", "World Civilizations II", "Civilización Mundial II", 3, "040"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "040"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "040"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "040"], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "050"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "050"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "050"], ["DANC 1305", "World Dance", "Danza Mundial", 3, "050"], ["DANC 2303", "Dance Appreciation", "Apreciación de la Danza", 3, "050"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "050"], ["DRAM 2366", "Film Appreciation", "Apreciación del Cine", 3, "050"], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "050"], ["MUSI 1307", "Music Literature", "Literatura Musical", 3, "050"], ["MUSI 1310", "American Music", "Música Americana", 3, "050"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "060"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "060"], ["HIST 2301", "Texas History", "Historia de Texas", 3, "060"], ["HIST 2327", "Mexican American History I (to the United States-Mexico War Era)", "Historia Mexicoamericana I", 3, "060"], ["HIST 2328", "Mexican American History II (from the United States-Mexico War Era)", "Historia Mexicoamericana II", 3, "060"], ["HIST 2381", "African American History I", "Historia Afroamericana I", 3, "060"], ["HIST 2382", "African American History II", "Historia Afroamericana II", 3, "060"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "070"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "070"], ["ANTH 2302", "Introduction to Archeology", "Introducción a la Arqueología", 3, "080"], ["ANTH 2346", "General Anthropology", "Antropología General", 3, "080"], ["ANTH 2351", "Cultural Anthropology", "Antropología Cultural", 3, "080"], ["CRIJ 1301", "Introduction to Criminal Justice", "Introducción a la Justicia Penal", 3, "080"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "080"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "080"], ["GEOG 1303", "World Regional Geography", "Geografía Regional Mundial", 3, "080"], ["GOVT 2304", "Introduction to Political Science", "Introducción a Ciencias Políticas", 3, "080"], ["HIST 2311", "Western Civilization I", "Civilización Occidental I", 3, "080"], ["HIST 2312", "Western Civilization II", "Civilización Occidental II", 3, "080"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "080"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "080"], ["SOCI 2319", "Minority Studies", "Estudios de Minorías", 3, "080"], ["TECA 1354", "Child Growth & Development", "Crecimiento y Desarrollo Infantil", 3, "080"], ["ASTR 1103", "Stars and Galaxies Laboratory (lab)", "Estrellas y Galaxias (laboratorio)", 1, "090"], ["ASTR 1104", "Solar System Laboratory (lab)", "El Sistema Solar (laboratorio)", 1, "090"], ["BIOL 1106", "Biology for Science Majors Laboratory I (lab)", "Biología para Ciencias I (laboratorio)", 1, "090"], ["BIOL 1107", "Biology for Science Majors Laboratory II (lab)", "Biología para Ciencias II (laboratorio)", 1, "090"], ["BIOL 1108", "Biology for Non-Science Majors Laboratory I (lab)", "Biología General I (laboratorio)", 1, "090"], ["BIOL 1109", "Biology for Non-Science Majors Laboratory II (lab)", "Biología General II (laboratorio)", 1, "090"], ["BIOL 2101", "Anatomy & Physiology I (lab)", "Anatomía y Fisiología I (laboratorio)", 1, "090"], ["BIOL 2102", "Anatomy & Physiology II (lab)", "Anatomía y Fisiología II (laboratorio)", 1, "090"], ["CHEM 1105", "Introductory Chemistry Laboratory I (lab)", "Química Introductoria I (laboratorio)", 1, "090"], ["CHEM 1111", "General Chemistry I (lab)", "Química General I (laboratorio)", 1, "090"], ["CHEM 1112", "General Chemistry II (lab)", "Química General II (laboratorio)", 1, "090"], ["CHIN 1411", "Beginning Chinese I", "Chino Básico I", 4, "090"], ["CHIN 1412", "Beginning Chinese II", "Chino Básico II", 4, "090"], ["EDUC 1100", "Learning Framework (1 SCH version)", "Marco de Aprendizaje", 1, "090"], ["FREN 1411", "Beginning French I (1st semester French, 4 SCH version)", "Francés Básico I", 4, "090"], ["FREN 1412", "Beginning French II (2nd semester French, 4 SCH version)", "Francés Básico II", 4, "090"], ["GEOL 1101", "Earth Sciences for Non-Science Majors I (lab)", "Ciencias de la Tierra I (laboratorio)", 1, "090"], ["GEOL 1103", "Physical Geology  (lab)", "Geología Física (laboratorio)", 1, "090"], ["GEOL 1104", "Historical Geology (lab)", "Geología Histórica (laboratorio)", 1, "090"], ["GERM 1411", "Beginning German I (1st semester German, 4 SCH version)", "Alemán Básico I", 4, "090"], ["GERM 1412", "Beginning German II (2nd semester German, 4 SCH version)", "Alemán Básico II", 4, "090"], ["GOVT 2107", "Federal and Texas Constitutions", "Constituciones Federal y de Texas", 1, "090"], ["PHED 1164", "Introduction to Physical Fitness & Wellness", "Introducción a la Aptitud Física y Bienestar", 1, "090"], ["PHYS 1101", "College Physics Laboratory I (lab)", "Física I (laboratorio)", 1, "090"], ["PHYS 1102", "College Physics Laboratory II (lab)", "Física II (laboratorio)", 1, "090"], ["PHYS 2125", "University Physics Laboratory I (lab)", "Física Universitaria I (laboratorio)", 1, "090"], ["PHYS 2126", "University Physics Laboratory II (lab)", "Física Universitaria II (laboratorio)", 1, "090"], ["SGNL 1401", "Beginning American Sign Language I (1st semester ASL, 4 SCH version)", "Lenguaje de Señas I", 4, "090"], ["SGNL 1402", "Beginning American Sign Language II (2nd semester ASL, 4 SCH version)", "Lenguaje de Señas II", 4, "090"], ["SPAN 1411", "Beginning Spanish I (1st semester Spanish, 4 SCH version)", "Español Básico I", 4, "090"], ["SPAN 1412", "Beginning Spanish II (2nd semester Spanish, 4 SCH version)", "Español Básico II", 4, "090"], ["SPCH 1311", "Introduction to Speech Communication", "Introducción a la Comunicación Oral", 3, "090"], ["SPCH 1315", "Public Speaking", "Oratoria", 3, "090"], ["SPCH 1318", "Interpersonal Communication", "Comunicación Interpersonal", 3, "090"], ["SPCH 1321", "Business & Professional Communication", "Comunicación Empresarial y Profesional", 3, "090"]];
const HCC_RAW = [["ENGL 1301", "Composition I", "Composición I", 3, "010"], ["ENGL 1302", "Composition II", "Composición II", 3, "010"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "010"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "020"], ["MATH 1316", "Plane Trigonometry", "Trigonometría Plana", 3, "020"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1325", "Calculus for Business & Social Sciences", "Cálculo para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "020"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "020"], ["MATH 1350", "Mathematics for Teachers I (Fundamentals of Mathematics I)", "", 3, "020"], ["MATH 2318", "Linear Algebra", "Álgebra Lineal", 3, "020"], ["MATH 2320", "Differential Equations", "Ecuaciones Diferenciales", 3, "020"], ["MATH 2412", "Pre-Calculus Math", "Precálculo", 4, "020"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "020"], ["PHIL 2303", "Introduction to Formal Logic", "", 3, "020"], ["PSYC 2317", "Statistical Methods in Psychology", "", 3, "020"], ["ANTH 2301", "Physical Anthropology (lecture)", "", 3, "030"], ["ASTR 1303", "Stars and Galaxies (lecture)", "Estrellas y Galaxias", 3, "030"], ["ASTR 1304", "Solar System (lecture)", "El Sistema Solar", 3, "030"], ["BIOL 1306", "Biology for Science Majors I (lecture)", "Biología para Ciencias I", 3, "030"], ["BIOL 1308", "Biology for Non-Science Majors I (lecture)", "Biología General I", 3, "030"], ["BIOL 1309", "Biology for Non-Science Majors II (lecture)", "Biología General II", 3, "030"], ["BIOL 1322", "Nutrition & Diet Therapy", "", 3, "030"], ["BIOL 1407", "Biology for Science Majors II (lecture + lab)", "", 4, "030"], ["BIOL 2301", "Anatomy & Physiology I (lecture)", "Anatomía y Fisiología I", 3, "030"], ["BIOL 2302", "Anatomy & Physiology II (lecture)", "Anatomía y Fisiología II", 3, "030"], ["CHEM 1305", "Introductory Chemistry I (lecture)", "Química Introductoria I", 3, "030"], ["CHEM 1311", "General Chemistry I (lecture)", "Química General I", 3, "030"], ["CHEM 1405", "Introductory Chemistry I (lecture + lab)", "", 4, "030"], ["CHEM 1412", "General Chemistry II (lecture + lab)", "", 4, "030"], ["GEOG 1301", "Physical Geography", "", 3, "030"], ["GEOL 1301", "Earth Sciences for Non-Science Majors I (lecture)", "Ciencias de la Tierra I", 3, "030"], ["GEOL 1305", "Environmental Science (lecture)", "", 3, "030"], ["GEOL 1345", "Oceanography (lecture)", "", 3, "030"], ["GEOL 1347", "Meteorology (lecture)", "", 3, "030"], ["GEOL 1403", "Physical Geology (lecture + lab)", "", 4, "030"], ["GEOL 1404", "Historical Geology (lecture + lab)", "", 4, "030"], ["PHYS 1305", "Elementary Physics I (lecture)", "", 3, "030"], ["PHYS 1401", "College Physics I (lecture + lab)", "", 4, "030"], ["PHYS 1402", "College Physics II (lecture + lab)", "", 4, "030"], ["PHYS 2325", "University Physics I (lecture)", "Física Universitaria I", 3, "030"], ["PHYS 2326", "University Physics II (lecture)", "Física Universitaria II", 3, "030"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "040"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "040"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "040"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "040"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "040"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "040"], ["ENGL 2341", "Forms of Literature", "Formas de Literatura", 3, "040"], ["ENGL 2351", "Mexican American Literature", "Literatura Mexicoamericana", 3, "040"], ["HIST 2311", "Western Civilization I", "Civilización Occidental I", 3, "040"], ["HIST 2312", "Western Civilization II", "Civilización Occidental II", 3, "040"], ["HIST 2321", "World Civilizations I", "Civilización Mundial I", 3, "040"], ["HIST 2322", "World Civilizations II", "Civilización Mundial II", 3, "040"], ["HUMA 1305", "Introduction to Mexican American Studies", "", 3, "040"], ["HUMA 2319", "American Minority Studies", "", 3, "040"], ["HUMA 2323", "World Cultures", "", 3, "040"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "040"], ["PHIL 1304", "Introduction to World Religions", "", 3, "040"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "040"], ["PHIL 2307", "Introduction to Social & Political Philosophy", "", 3, "040"], ["PHIL 2316", "Classical Philosophy", "", 3, "040"], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "050"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "050"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "050"], ["ARTS 1311", "Design I   (2-dimensional)", "", 3, "050"], ["ARTS 1312", "Design II (3-dimensional)", "", 3, "050"], ["ARTS 1313", "Foundations of Art", "", 3, "050"], ["ARTS 1316", "Drawing I", "", 3, "050"], ["ARTS 2348", "Digital Media", "", 3, "050"], ["DANC 1305", "World Dance", "Danza Mundial", 3, "050"], ["DANC 2303", "Dance Appreciation", "Apreciación de la Danza", 3, "050"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "050"], ["DRAM 2361", "History of the Theater I", "", 3, "050"], ["DRAM 2366", "Film Appreciation", "Apreciación del Cine", 3, "050"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "050"], ["HUMA 1311", "Mexican American Fine Arts Appreciation", "", 3, "050"], ["MUSI 1303", "Fundamentals Of Music", "", 3, "050"], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "050"], ["MUSI 1307", "Music Literature", "Literatura Musical", 3, "050"], ["MUSI 1310", "American Music", "Música Americana", 3, "050"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "060"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "060"], ["HIST 2301", "Texas History", "Historia de Texas", 3, "060"], ["HIST 2327", "Mexican American History I (to the United States-Mexico War Era)", "Historia Mexicoamericana I", 3, "060"], ["HIST 2328", "Mexican American History II (from the United States-Mexico War Era)", "Historia Mexicoamericana II", 3, "060"], ["HIST 2381", "African American History I", "Historia Afroamericana I", 3, "060"], ["HIST 2382", "African American History II", "Historia Afroamericana II", 3, "060"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "070"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "070"], ["ANTH 2346", "General Anthropology", "Antropología General", 3, "080"], ["ANTH 2351", "Cultural Anthropology", "Antropología Cultural", 3, "080"], ["ECON 1301", "Introduction To Economics", "", 3, "080"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "080"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "080"], ["GEOG 1302", "Human Geography", "Geografía Humana", 3, "080"], ["GEOG 1303", "World Regional Geography", "Geografía Regional Mundial", 3, "080"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "080"], ["PSYC 2314", "Lifespan Growth & Development", "", 3, "080"], ["PSYC 2316", "Psychology of Personality", "", 3, "080"], ["PSYC 2319", "Social Psychology", "", 3, "080"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "080"], ["SOCI 1306", "Social Problems", "", 3, "080"], ["SOCI 2336", "Criminology", "", 3, "080"], ["TECA 1354", "Child Growth & Development", "Crecimiento y Desarrollo Infantil", 3, "080"], ["ANTH 2101", "Physical Anthropology (lab)", "", 1, "090"], ["ANTH 2301", "Physical Anthropology (lecture)", "", 3, "090"], ["ANTH 2302", "Introduction to Archeology", "Introducción a la Arqueología", 3, "090"], ["ANTH 2346", "General Anthropology", "Antropología General", 3, "090"], ["ANTH 2351", "Cultural Anthropology", "Antropología Cultural", 3, "090"], ["ARAB 1411", "Beginning Arabic I", "", 4, "090"], ["ARAB 1412", "Beginning Arabic II", "", 4, "090"], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "090"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "090"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "090"], ["ARTS 1313", "Foundations of Art", "", 3, "090"], ["ASTR 1103", "Stars and Galaxies Laboratory (lab)", "Estrellas y Galaxias (laboratorio)", 1, "090"], ["ASTR 1104", "Solar System Laboratory (lab)", "El Sistema Solar (laboratorio)", 1, "090"], ["ASTR 1303", "Stars and Galaxies (lecture)", "Estrellas y Galaxias", 3, "090"], ["ASTR 1304", "Solar System (lecture)", "El Sistema Solar", 3, "090"], ["BIOL 1106", "Biology for Science Majors Laboratory I (lab)", "Biología para Ciencias I (laboratorio)", 1, "090"], ["BIOL 1306", "Biology for Science Majors I (lecture)", "Biología para Ciencias I", 3, "090"], ["BIOL 1308", "Biology for Non-Science Majors I (lecture)", "Biología General I", 3, "090"], ["BIOL 1309", "Biology for Non-Science Majors II (lecture)", "Biología General II", 3, "090"], ["BIOL 1322", "Nutrition & Diet Therapy", "", 3, "090"], ["BIOL 1407", "Biology for Science Majors II (lecture + lab)", "", 4, "090"], ["CHEM 1111", "General Chemistry I (lab)", "Química General I (laboratorio)", 1, "090"], ["CHEM 1305", "Introductory Chemistry I (lecture)", "Química Introductoria I", 3, "090"], ["CHEM 1311", "General Chemistry I (lecture)", "Química General I", 3, "090"], ["CHEM 1405", "Introductory Chemistry I (lecture + lab)", "", 4, "090"], ["CHEM 1412", "General Chemistry II (lecture + lab)", "", 4, "090"], ["CHIN 1411", "Beginning Chinese I", "Chino Básico I", 4, "090"], ["CHIN 1412", "Beginning Chinese II", "Chino Básico II", 4, "090"], ["COMM 1307", "Introduction to Mass Communication", "", 3, "090"], ["COMM 2311", "Media Writing", "", 3, "090"], ["COSC 1436", "Programming Fundamentals I", "", 4, "090"], ["DANC 1305", "World Dance", "Danza Mundial", 3, "090"], ["DANC 2303", "Dance Appreciation", "Apreciación de la Danza", 3, "090"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "090"], ["DRAM 2361", "History of the Theater I", "", 3, "090"], ["DRAM 2366", "Film Appreciation", "Apreciación del Cine", 3, "090"], ["ECON 1301", "Introduction To Economics", "", 3, "090"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "090"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "090"], ["EDUC 1300", "Learning Framework", "", 3, "090"], ["ENGL 1301", "Composition I", "Composición I", 3, "090"], ["ENGL 1302", "Composition II", "Composición II", 3, "090"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "090"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "090"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "090"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "090"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "090"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "090"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "090"], ["ENGL 2341", "Forms of Literature", "Formas de Literatura", 3, "090"], ["ENGL 2351", "Mexican American Literature", "Literatura Mexicoamericana", 3, "090"], ["FREN 1411", "Beginning French I (1st semester French, 4 SCH version)", "Francés Básico I", 4, "090"], ["FREN 1412", "Beginning French II (2nd semester French, 4 SCH version)", "Francés Básico II", 4, "090"], ["GEOG 1301", "Physical Geography", "", 3, "090"], ["GEOG 1302", "Human Geography", "Geografía Humana", 3, "090"], ["GEOG 1303", "World Regional Geography", "Geografía Regional Mundial", 3, "090"], ["GEOL 1105", "Environmental Science (lab)", "", 1, "090"], ["GEOL 1301", "Earth Sciences for Non-Science Majors I (lecture)", "Ciencias de la Tierra I", 3, "090"], ["GEOL 1305", "Environmental Science (lecture)", "", 3, "090"], ["GEOL 1345", "Oceanography (lecture)", "", 3, "090"], ["GEOL 1347", "Meteorology (lecture)", "", 3, "090"], ["GEOL 1403", "Physical Geology (lecture + lab)", "", 4, "090"], ["GEOL 1404", "Historical Geology (lecture + lab)", "", 4, "090"], ["GERM 1411", "Beginning German I (1st semester German, 4 SCH version)", "Alemán Básico I", 4, "090"], ["GERM 1412", "Beginning German II (2nd semester German, 4 SCH version)", "Alemán Básico II", 4, "090"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "090"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "090"], ["HIST 2301", "Texas History", "Historia de Texas", 3, "090"], ["HIST 2311", "Western Civilization I", "Civilización Occidental I", 3, "090"], ["HIST 2312", "Western Civilization II", "Civilización Occidental II", 3, "090"], ["HIST 2321", "World Civilizations I", "Civilización Mundial I", 3, "090"], ["HIST 2322", "World Civilizations II", "Civilización Mundial II", 3, "090"], ["HIST 2327", "Mexican American History I (to the United States-Mexico War Era)", "Historia Mexicoamericana I", 3, "090"], ["HIST 2328", "Mexican American History II (from the United States-Mexico War Era)", "Historia Mexicoamericana II", 3, "090"], ["HIST 2381", "African American History I", "Historia Afroamericana I", 3, "090"], ["HIST 2382", "African American History II", "Historia Afroamericana II", 3, "090"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "090"], ["HUMA 1305", "Introduction to Mexican American Studies", "", 3, "090"], ["HUMA 1311", "Mexican American Fine Arts Appreciation", "", 3, "090"], ["HUMA 2319", "American Minority Studies", "", 3, "090"], ["HUMA 2323", "World Cultures", "", 3, "090"], ["JAPN 1411", "Beginning Japanese I (1st semester Japanese, 4 SCH version)", "", 4, "090"], ["JAPN 1412", "Beginning Japanese II (2nd semester Japanese, 4 SCH version)", "", 4, "090"], ["KORE 1411", "Beginning Korean I (1st semester Korean, 4 SCH version)", "", 4, "090"], ["KORE 1412", "Beginning Korean II (2nd semester Korean, 4 SCH version)", "", 4, "090"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "090"], ["MATH 1316", "Plane Trigonometry", "Trigonometría Plana", 3, "090"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "090"], ["MATH 1325", "Calculus for Business & Social Sciences", "Cálculo para Negocios y Ciencias Sociales", 3, "090"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "090"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "090"], ["MATH 1350", "Mathematics for Teachers I (Fundamentals of Mathematics I)", "", 3, "090"], ["MATH 1351", "Mathematics for Teachers II  (Fundamentals of Mathematics II)", "", 3, "090"], ["MATH 2318", "Linear Algebra", "Álgebra Lineal", 3, "090"], ["MATH 2320", "Differential Equations", "Ecuaciones Diferenciales", 3, "090"], ["MATH 2412", "Pre-Calculus Math", "Precálculo", 4, "090"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "090"], ["MATH 2414", "Calculus II", "Cálculo II", 4, "090"], ["MATH 2415", "Calculus III", "", 4, "090"], ["MUSI 1303", "Fundamentals Of Music", "", 3, "090"], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "090"], ["MUSI 1307", "Music Literature", "Literatura Musical", 3, "090"], ["MUSI 1310", "American Music", "Música Americana", 3, "090"], ["PHED 1304", "Personal/Community Health", "", 3, "090"], ["PHED 1306", "First Aid, CPR, and Safety Practices", "", 3, "090"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "090"], ["PHIL 1304", "Introduction to World Religions", "", 3, "090"], ["PHIL 2303", "Introduction to Formal Logic", "", 3, "090"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "090"], ["PHIL 2307", "Introduction to Social & Political Philosophy", "", 3, "090"], ["PHIL 2316", "Classical Philosophy", "", 3, "090"], ["PHYS 1305", "Elementary Physics I (lecture)", "", 3, "090"], ["PHYS 1401", "College Physics I (lecture + lab)", "", 4, "090"], ["PHYS 1402", "College Physics II (lecture + lab)", "", 4, "090"], ["PHYS 2125", "University Physics Laboratory I (lab)", "Física Universitaria I (laboratorio)", 1, "090"], ["PHYS 2126", "University Physics Laboratory II (lab)", "Física Universitaria II (laboratorio)", 1, "090"], ["PHYS 2325", "University Physics I (lecture)", "Física Universitaria I", 3, "090"], ["PHYS 2326", "University Physics II (lecture)", "Física Universitaria II", 3, "090"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "090"], ["PSYC 2314", "Lifespan Growth & Development", "", 3, "090"], ["PSYC 2316", "Psychology of Personality", "", 3, "090"], ["PSYC 2317", "Statistical Methods in Psychology", "", 3, "090"], ["PSYC 2319", "Social Psychology", "", 3, "090"], ["PSYC 2320", "Abnormal Psychology", "", 3, "090"], ["PSYC 2330", "Biological Psychology", "", 3, "090"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "090"], ["SOCI 1306", "Social Problems", "", 3, "090"], ["SOCI 2301", "Marriage & the Family", "", 3, "090"], ["SOCI 2326", "Social Psychology", "", 3, "090"], ["SOCI 2336", "Criminology", "", 3, "090"], ["SPAN 1411", "Beginning Spanish I (1st semester Spanish, 4 SCH version)", "Español Básico I", 4, "090"], ["SPAN 1412", "Beginning Spanish II (2nd semester Spanish, 4 SCH version)", "Español Básico II", 4, "090"], ["SPCH 1311", "Introduction to Speech Communication", "Introducción a la Comunicación Oral", 3, "090"], ["SPCH 1315", "Public Speaking", "Oratoria", 3, "090"], ["SPCH 1318", "Interpersonal Communication", "Comunicación Interpersonal", 3, "090"], ["SPCH 1321", "Business & Professional Communication", "Comunicación Empresarial y Profesional", 3, "090"], ["TECA 1354", "Child Growth & Development", "Crecimiento y Desarrollo Infantil", 3, "090"]];
const LSC_RAW = [["ENGL 1301", "Composition I", "Composición I", 3, "010"], ["ENGL 1302", "Composition II", "Composición II", 3, "010"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "010"], ["SPCH 1311", "Introduction to Speech Communication", "Introducción a la Comunicación Oral", 3, "010"], ["SPCH 1315", "Public Speaking", "Oratoria", 3, "010"], ["SPCH 1318", "Interpersonal Communication", "Comunicación Interpersonal", 3, "010"], ["SPCH 1321", "Business & Professional Communication", "Comunicación Empresarial y Profesional", 3, "010"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "020"], ["MATH 1316", "Plane Trigonometry", "Trigonometría Plana", 3, "020"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1325", "Calculus for Business & Social Sciences", "Cálculo para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "020"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "020"], ["MATH 1350", "Mathematics for Teachers I (Fundamentals of Mathematics I)", "", 3, "020"], ["MATH 1351", "Mathematics for Teachers II  (Fundamentals of Mathematics II)", "", 3, "020"], ["MATH 2318", "Linear Algebra", "Álgebra Lineal", 3, "020"], ["MATH 2412", "Pre-Calculus Math", "Precálculo", 4, "020"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "020"], ["MATH 2414", "Calculus II", "Cálculo II", 4, "020"], ["PHIL 2303", "Introduction to Formal Logic", "", 3, "020"], ["BIOL 1406", "Biology for Science Majors I (lecture + lab)", "", 4, "030"], ["BIOL 1407", "Biology for Science Majors II (lecture + lab)", "", 4, "030"], ["BIOL 1408", "Biology for Non-Science Majors I (lecture + lab)", "", 4, "030"], ["BIOL 1409", "Biology for Non-Science Majors II (lecture + lab)", "", 4, "030"], ["BIOL 1414", "Introduction to Biotechnology I", "", 4, "030"], ["BIOL 1415", "Introduction to Biotechnology II", "", 4, "030"], ["BIOL 2401", "Anatomy & Physiology I (lecture + lab)", "", 4, "030"], ["BIOL 2402", "Anatomy & Physiology II (lecture + lab)", "", 4, "030"], ["BIOL 2404", "Anatomy & Physiology (specialized, single-semester course, lecture + lab)", "", 4, "030"], ["BIOL 2406", "Environmental Biology (lecture + lab)", "", 4, "030"], ["BIOL 2420", "Microbiology for Non-Science Majors (lecture + lab)", "", 4, "030"], ["BIOL 2421", "Microbiology for Science Majors (lecture + lab)", "", 4, "030"], ["CHEM 1405", "Introductory Chemistry I (lecture + lab)", "", 4, "030"], ["CHEM 1407", "Introductory Chemistry II (lecture + lab)", "", 4, "030"], ["CHEM 1411", "General Chemistry I (lecture + lab)", "", 4, "030"], ["CHEM 1412", "General Chemistry II (lecture + lab)", "", 4, "030"], ["CHEM 2423", "Organic Chemistry I (lecture + lab)", "", 4, "030"], ["CHEM 2425", "Organic Chemistry II (lecture + lab)", "", 4, "030"], ["ENVR 1401", "Environmental Science I (lecture + lab)", "", 4, "030"], ["ENVR 1402", "Environmental Science II (lecture + lab)", "", 4, "030"], ["GEOL 1401", "Earth Sciences for Non-Science Majors  I (lecture + lab)", "", 4, "030"], ["GEOL 1402", "Earth Sciences for Non-Science Majors II (lecture + lab)", "", 4, "030"], ["GEOL 1403", "Physical Geology (lecture + lab)", "", 4, "030"], ["GEOL 1404", "Historical Geology (lecture + lab)", "", 4, "030"], ["GEOL 1405", "Environmental Science (lecture + lab)", "", 4, "030"], ["GEOL 1445", "Oceanography (lecture + lab)", "", 4, "030"], ["GEOL 1447", "Meteorology (lecture + lab)", "", 4, "030"], ["PHYS 1401", "College Physics I (lecture + lab)", "", 4, "030"], ["PHYS 1402", "College Physics II (lecture + lab)", "", 4, "030"], ["PHYS 1403", "Stars and Galaxies (lecture + lab)", "", 4, "030"], ["PHYS 1404", "Solar System (lecture + lab)", "", 4, "030"], ["PHYS 1410", "Elementary Physics (single-semester course, lecture + lab)", "", 4, "030"], ["PHYS 2425", "University Physics I (lecture + lab)", "", 4, "030"], ["PHYS 2426", "University Physics II (lecture + lab)", "", 4, "030"], ["ARAB 2311", "Intermediate Arabic I", "", 3, "040"], ["ARAB 2312", "Intermediate Arabic II", "", 3, "040"], ["CHIN 2311", "Intermediate Chinese I", "", 3, "040"], ["CHIN 2312", "Intermediate Chinese II", "", 3, "040"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "040"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "040"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "040"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "040"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "040"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "040"], ["ENGL 2341", "Forms of Literature", "Formas de Literatura", 3, "040"], ["ENGL 2351", "Mexican American Literature", "Literatura Mexicoamericana", 3, "040"], ["FREN 2311", "Intermediate French I (3rd semester French)", "", 3, "040"], ["FREN 2312", "Intermediate French II (4th semester French)", "", 3, "040"], ["GERM 2311", "Intermediate German I (3rd semester German)", "", 3, "040"], ["GERM 2312", "Intermediate German II (4th semester German)", "", 3, "040"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "040"], ["HUMA 1302", "Introduction to Humanities II", "", 3, "040"], ["HUMA 1305", "Introduction to Mexican American Studies", "", 3, "040"], ["HUMA 1311", "Mexican American Fine Arts Appreciation", "", 3, "040"], ["HUMA 2319", "American Minority Studies", "", 3, "040"], ["ITAL 2311", "Intermediate Italian I (3rd semester Italian)", "", 3, "040"], ["ITAL 2312", "Intermediate Italian II (4th semester Italian)", "", 3, "040"], ["JAPN 2311", "Intermediate Japanese I (3rd semester Japanese)", "", 3, "040"], ["JAPN 2312", "Intermediate Japanese II (4th semester Japanese)", "", 3, "040"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "040"], ["PHIL 1304", "Introduction to World Religions", "", 3, "040"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "040"], ["PHIL 2307", "Introduction to Social & Political Philosophy", "", 3, "040"], ["PHIL 2316", "Classical Philosophy", "", 3, "040"], ["PHIL 2321", "Philosophy of Religion", "", 3, "040"], ["PORT 2311", "Intermediate Portuguese I   (3rd semester Portuguese)", "", 3, "040"], ["PORT 2312", "Intermediate Portuguese II (4th semester Portuguese)", "", 3, "040"], ["SGNL 2301", "Intermediate American Sign Language I   (3rd semester ASL)", "", 3, "040"], ["SGNL 2302", "Intermediate American Sign Language II (4th semester ASL)", "", 3, "040"], ["SPAN 2311", "Intermediate Spanish I (3rd semester Spanish)", "", 3, "040"], ["SPAN 2312", "Intermediate Spanish II (4th semester Spanish)", "", 3, "040"], ["SPAN 2313", "Spanish for Native/Heritage Speakers I", "", 3, "040"], ["SPAN 2315", "Spanish for Native/Heritage Speakers II", "", 3, "040"], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "050"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "050"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "050"], ["ARTS 1311", "Design I   (2-dimensional)", "", 3, "050"], ["ARTS 1312", "Design II (3-dimensional)", "", 3, "050"], ["ARTS 1316", "Drawing I", "", 3, "050"], ["DANC 2303", "Dance Appreciation", "Apreciación de la Danza", 3, "050"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "050"], ["DRAM 2366", "Film Appreciation", "Apreciación del Cine", 3, "050"], ["MUSI 1303", "Fundamentals Of Music", "", 3, "050"], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "050"], ["MUSI 1307", "Music Literature", "Literatura Musical", 3, "050"], ["MUSI 1310", "American Music", "Música Americana", 3, "050"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "060"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "060"], ["HIST 2301", "Texas History", "Historia de Texas", 3, "060"], ["HIST 2327", "Mexican American History I (to the United States-Mexico War Era)", "Historia Mexicoamericana I", 3, "060"], ["HIST 2328", "Mexican American History II (from the United States-Mexico War Era)", "Historia Mexicoamericana II", 3, "060"], ["HIST 2381", "African American History I", "Historia Afroamericana I", 3, "060"], ["HIST 2382", "African American History II", "Historia Afroamericana II", 3, "060"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "070"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "070"], ["ANTH 2301", "Physical Anthropology (lecture)", "", 3, "080"], ["ANTH 2351", "Cultural Anthropology", "Antropología Cultural", 3, "080"], ["CRIJ 1301", "Introduction to Criminal Justice", "Introducción a la Justicia Penal", 3, "080"], ["CRIJ 1307", "Crime in America", "", 3, "080"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "080"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "080"], ["GEOG 1301", "Physical Geography", "", 3, "080"], ["GEOG 1303", "World Regional Geography", "Geografía Regional Mundial", 3, "080"], ["GOVT 2304", "Introduction to Political Science", "Introducción a Ciencias Políticas", 3, "080"], ["GOVT 2311", "Mexican American and Latinx Politics", "", 3, "080"], ["HIST 2311", "Western Civilization I", "Civilización Occidental I", 3, "080"], ["HIST 2312", "Western Civilization II", "Civilización Occidental II", 3, "080"], ["HIST 2321", "World Civilizations I", "Civilización Mundial I", 3, "080"], ["HIST 2322", "World Civilizations II", "Civilización Mundial II", 3, "080"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "080"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "080"], ["SOCI 1306", "Social Problems", "", 3, "080"], ["TECA 1354", "Child Growth & Development", "Crecimiento y Desarrollo Infantil", 3, "080"], ["ANTH 2301", "Physical Anthropology (lecture)", "", 3, "090"], ["ANTH 2351", "Cultural Anthropology", "Antropología Cultural", 3, "090"], ["ARAB 2311", "Intermediate Arabic I", "", 3, "090"], ["ARAB 2312", "Intermediate Arabic II", "", 3, "090"], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "090"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "090"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "090"], ["ARTS 1311", "Design I   (2-dimensional)", "", 3, "090"], ["ARTS 1312", "Design II (3-dimensional)", "", 3, "090"], ["ARTS 1316", "Drawing I", "", 3, "090"], ["BIOL 1406", "Biology for Science Majors I (lecture + lab)", "", 4, "090"], ["BIOL 1407", "Biology for Science Majors II (lecture + lab)", "", 4, "090"], ["BIOL 1408", "Biology for Non-Science Majors I (lecture + lab)", "", 4, "090"], ["BIOL 1409", "Biology for Non-Science Majors II (lecture + lab)", "", 4, "090"], ["BIOL 1414", "Introduction to Biotechnology I", "", 4, "090"], ["BIOL 1415", "Introduction to Biotechnology II", "", 4, "090"], ["BIOL 2401", "Anatomy & Physiology I (lecture + lab)", "", 4, "090"], ["BIOL 2402", "Anatomy & Physiology II (lecture + lab)", "", 4, "090"], ["BIOL 2404", "Anatomy & Physiology (specialized, single-semester course, lecture + lab)", "", 4, "090"], ["BIOL 2406", "Environmental Biology (lecture + lab)", "", 4, "090"], ["BIOL 2420", "Microbiology for Non-Science Majors (lecture + lab)", "", 4, "090"], ["BIOL 2421", "Microbiology for Science Majors (lecture + lab)", "", 4, "090"], ["CHEM 1405", "Introductory Chemistry I (lecture + lab)", "", 4, "090"], ["CHEM 1407", "Introductory Chemistry II (lecture + lab)", "", 4, "090"], ["CHEM 1411", "General Chemistry I (lecture + lab)", "", 4, "090"], ["CHEM 1412", "General Chemistry II (lecture + lab)", "", 4, "090"], ["CHEM 2423", "Organic Chemistry I (lecture + lab)", "", 4, "090"], ["CHEM 2425", "Organic Chemistry II (lecture + lab)", "", 4, "090"], ["CHIN 2311", "Intermediate Chinese I", "", 3, "090"], ["CHIN 2312", "Intermediate Chinese II", "", 3, "090"], ["CRIJ 1301", "Introduction to Criminal Justice", "Introducción a la Justicia Penal", 3, "090"], ["CRIJ 1307", "Crime in America", "", 3, "090"], ["DANC 2303", "Dance Appreciation", "Apreciación de la Danza", 3, "090"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "090"], ["DRAM 2366", "Film Appreciation", "Apreciación del Cine", 3, "090"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "090"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "090"], ["EDUC 1300", "Learning Framework", "", 3, "090"], ["ENGL 1301", "Composition I", "Composición I", 3, "090"], ["ENGL 1302", "Composition II", "Composición II", 3, "090"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "090"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "090"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "090"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "090"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "090"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "090"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "090"], ["ENGL 2341", "Forms of Literature", "Formas de Literatura", 3, "090"], ["ENGL 2351", "Mexican American Literature", "Literatura Mexicoamericana", 3, "090"], ["ENVR 1401", "Environmental Science I (lecture + lab)", "", 4, "090"], ["ENVR 1402", "Environmental Science II (lecture + lab)", "", 4, "090"], ["FREN 2311", "Intermediate French I (3rd semester French)", "", 3, "090"], ["FREN 2312", "Intermediate French II (4th semester French)", "", 3, "090"], ["GEOG 1301", "Physical Geography", "", 3, "090"], ["GEOG 1303", "World Regional Geography", "Geografía Regional Mundial", 3, "090"], ["GEOL 1401", "Earth Sciences for Non-Science Majors  I (lecture + lab)", "", 4, "090"], ["GEOL 1402", "Earth Sciences for Non-Science Majors II (lecture + lab)", "", 4, "090"], ["GEOL 1403", "Physical Geology (lecture + lab)", "", 4, "090"], ["GEOL 1404", "Historical Geology (lecture + lab)", "", 4, "090"], ["GEOL 1405", "Environmental Science (lecture + lab)", "", 4, "090"], ["GEOL 1445", "Oceanography (lecture + lab)", "", 4, "090"], ["GEOL 1447", "Meteorology (lecture + lab)", "", 4, "090"], ["GERM 2311", "Intermediate German I (3rd semester German)", "", 3, "090"], ["GERM 2312", "Intermediate German II (4th semester German)", "", 3, "090"], ["GOVT 2304", "Introduction to Political Science", "Introducción a Ciencias Políticas", 3, "090"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "090"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "090"], ["GOVT 2311", "Mexican American and Latinx Politics", "", 3, "090"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "090"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "090"], ["HIST 2301", "Texas History", "Historia de Texas", 3, "090"], ["HIST 2311", "Western Civilization I", "Civilización Occidental I", 3, "090"], ["HIST 2312", "Western Civilization II", "Civilización Occidental II", 3, "090"], ["HIST 2321", "World Civilizations I", "Civilización Mundial I", 3, "090"], ["HIST 2322", "World Civilizations II", "Civilización Mundial II", 3, "090"], ["HIST 2327", "Mexican American History I (to the United States-Mexico War Era)", "Historia Mexicoamericana I", 3, "090"], ["HIST 2328", "Mexican American History II (from the United States-Mexico War Era)", "Historia Mexicoamericana II", 3, "090"], ["HIST 2381", "African American History I", "Historia Afroamericana I", 3, "090"], ["HIST 2382", "African American History II", "Historia Afroamericana II", 3, "090"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "090"], ["HUMA 1302", "Introduction to Humanities II", "", 3, "090"], ["HUMA 1305", "Introduction to Mexican American Studies", "", 3, "090"], ["HUMA 1311", "Mexican American Fine Arts Appreciation", "", 3, "090"], ["HUMA 2319", "American Minority Studies", "", 3, "090"], ["ITAL 2311", "Intermediate Italian I (3rd semester Italian)", "", 3, "090"], ["ITAL 2312", "Intermediate Italian II (4th semester Italian)", "", 3, "090"], ["JAPN 2311", "Intermediate Japanese I (3rd semester Japanese)", "", 3, "090"], ["JAPN 2312", "Intermediate Japanese II (4th semester Japanese)", "", 3, "090"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "090"], ["MATH 1316", "Plane Trigonometry", "Trigonometría Plana", 3, "090"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "090"], ["MATH 1325", "Calculus for Business & Social Sciences", "Cálculo para Negocios y Ciencias Sociales", 3, "090"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "090"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "090"], ["MATH 1350", "Mathematics for Teachers I (Fundamentals of Mathematics I)", "", 3, "090"], ["MATH 1351", "Mathematics for Teachers II  (Fundamentals of Mathematics II)", "", 3, "090"], ["MATH 2318", "Linear Algebra", "Álgebra Lineal", 3, "090"], ["MATH 2412", "Pre-Calculus Math", "Precálculo", 4, "090"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "090"], ["MATH 2414", "Calculus II", "Cálculo II", 4, "090"], ["MUSI 1303", "Fundamentals Of Music", "", 3, "090"], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "090"], ["MUSI 1307", "Music Literature", "Literatura Musical", 3, "090"], ["MUSI 1310", "American Music", "Música Americana", 3, "090"], ["PHED 1164", "Introduction to Physical Fitness & Wellness", "Introducción a la Aptitud Física y Bienestar", 1, "090"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "090"], ["PHIL 1304", "Introduction to World Religions", "", 3, "090"], ["PHIL 2303", "Introduction to Formal Logic", "", 3, "090"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "090"], ["PHIL 2307", "Introduction to Social & Political Philosophy", "", 3, "090"], ["PHIL 2316", "Classical Philosophy", "", 3, "090"], ["PHIL 2321", "Philosophy of Religion", "", 3, "090"], ["PHYS 1401", "College Physics I (lecture + lab)", "", 4, "090"], ["PHYS 1402", "College Physics II (lecture + lab)", "", 4, "090"], ["PHYS 1403", "Stars and Galaxies (lecture + lab)", "", 4, "090"], ["PHYS 1404", "Solar System (lecture + lab)", "", 4, "090"], ["PHYS 1410", "Elementary Physics (single-semester course, lecture + lab)", "", 4, "090"], ["PHYS 2425", "University Physics I (lecture + lab)", "", 4, "090"], ["PHYS 2426", "University Physics II (lecture + lab)", "", 4, "090"], ["PORT 2311", "Intermediate Portuguese I   (3rd semester Portuguese)", "", 3, "090"], ["PORT 2312", "Intermediate Portuguese II (4th semester Portuguese)", "", 3, "090"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "090"], ["SGNL 2301", "Intermediate American Sign Language I   (3rd semester ASL)", "", 3, "090"], ["SGNL 2302", "Intermediate American Sign Language II (4th semester ASL)", "", 3, "090"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "090"], ["SOCI 1306", "Social Problems", "", 3, "090"], ["SPAN 2311", "Intermediate Spanish I (3rd semester Spanish)", "", 3, "090"], ["SPAN 2312", "Intermediate Spanish II (4th semester Spanish)", "", 3, "090"], ["SPAN 2313", "Spanish for Native/Heritage Speakers I", "", 3, "090"], ["SPAN 2315", "Spanish for Native/Heritage Speakers II", "", 3, "090"], ["SPCH 1311", "Introduction to Speech Communication", "Introducción a la Comunicación Oral", 3, "090"], ["SPCH 1315", "Public Speaking", "Oratoria", 3, "090"], ["SPCH 1318", "Interpersonal Communication", "Comunicación Interpersonal", 3, "090"], ["SPCH 1321", "Business & Professional Communication", "Comunicación Empresarial y Profesional", 3, "090"], ["TECA 1354", "Child Growth & Development", "Crecimiento y Desarrollo Infantil", 3, "090"]];
const ALVIN_RAW = [["ENGL 1301", "Composition I", "Composición I", 3, "010"], ["ENGL 1302", "Composition II", "Composición II", 3, "010"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "010"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "020"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1325", "Calculus for Business & Social Sciences", "Cálculo para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "020"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "020"], ["MATH 1350", "Mathematics for Teachers I (Fundamentals of Mathematics I)", "", 3, "020"], ["MATH 2412", "Pre-Calculus Math", "Precálculo", 4, "020"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "020"], ["MATH 2414", "Calculus II", "Cálculo II", 4, "020"], ["ASTR 1403", "Stars and Galaxies (lecture + lab)", "", 4, "030"], ["ASTR 1404", "Solar System (lecture + lab)", "", 4, "030"], ["BIOL 1308", "Biology for Non-Science Majors I (lecture)", "Biología General I", 3, "030"], ["BIOL 1309", "Biology for Non-Science Majors II (lecture)", "Biología General II", 3, "030"], ["BIOL 1406", "Biology for Science Majors I (lecture + lab)", "", 4, "030"], ["BIOL 1407", "Biology for Science Majors II (lecture + lab)", "", 4, "030"], ["BIOL 2401", "Anatomy & Physiology I (lecture + lab)", "", 4, "030"], ["BIOL 2402", "Anatomy & Physiology II (lecture + lab)", "", 4, "030"], ["CHEM 1405", "Introductory Chemistry I (lecture + lab)", "", 4, "030"], ["CHEM 1411", "General Chemistry I (lecture + lab)", "", 4, "030"], ["CHEM 1412", "General Chemistry II (lecture + lab)", "", 4, "030"], ["CHEM 2423", "Organic Chemistry I (lecture + lab)", "", 4, "030"], ["CHEM 2425", "Organic Chemistry II (lecture + lab)", "", 4, "030"], ["GEOL 1301", "Earth Sciences for Non-Science Majors I (lecture)", "Ciencias de la Tierra I", 3, "030"], ["GEOL 1303", "Physical Geology (lecture)", "Geología Física", 3, "030"], ["GEOL 1401", "Earth Sciences for Non-Science Majors  I (lecture + lab)", "", 4, "030"], ["GEOL 1403", "Physical Geology (lecture + lab)", "", 4, "030"], ["GEOL 1404", "Historical Geology (lecture + lab)", "", 4, "030"], ["GEOL 1405", "Environmental Science (lecture + lab)", "", 4, "030"], ["GEOL 1445", "Oceanography (lecture + lab)", "", 4, "030"], ["GEOL 1447", "Meteorology (lecture + lab)", "", 4, "030"], ["PHYS 1301", "College Physics I (lecture)", "Física I", 3, "030"], ["PHYS 1401", "College Physics I (lecture + lab)", "", 4, "030"], ["PHYS 1402", "College Physics II (lecture + lab)", "", 4, "030"], ["PHYS 1403", "Stars and Galaxies (lecture + lab)", "", 4, "030"], ["PHYS 1404", "Solar System (lecture + lab)", "", 4, "030"], ["PHYS 1410", "Elementary Physics (single-semester course, lecture + lab)", "", 4, "030"], ["PHYS 2425", "University Physics I (lecture + lab)", "", 4, "030"], ["PHYS 2426", "University Physics II (lecture + lab)", "", 4, "030"], ["COMM 1307", "Introduction to Mass Communication", "", 3, "040"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "040"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "040"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "040"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "040"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "040"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "040"], ["FREN 2311", "Intermediate French I (3rd semester French)", "", 3, "040"], ["FREN 2312", "Intermediate French II (4th semester French)", "", 3, "040"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "040"], ["HUMA 1302", "Introduction to Humanities II", "", 3, "040"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "040"], ["PHIL 1304", "Introduction to World Religions", "", 3, "040"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "040"], ["SPAN 2311", "Intermediate Spanish I (3rd semester Spanish)", "", 3, "040"], ["SPAN 2312", "Intermediate Spanish II (4th semester Spanish)", "", 3, "040"], ["SPAN 2313", "Spanish for Native/Heritage Speakers I", "", 3, "040"], ["SPAN 2315", "Spanish for Native/Heritage Speakers II", "", 3, "040"], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "050"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "050"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "050"], ["COMM 2366", "Film Appreciation (title change)", "", 3, "050"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "050"], ["DRAM 2362", "History of the Theater II", "", 3, "050"], ["DRAM 2366", "Film Appreciation", "Apreciación del Cine", 3, "050"], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "050"], ["MUSI 1307", "Music Literature", "Literatura Musical", 3, "050"], ["MUSI 1308", "Music Literature I (scheduled for deletion, funding ends August 31, 2019)", "", 3, "050"], ["MUSI 1309", "Music Literature II (scheduled for deletion, funding ends August 31, 2019)", "", 3, "050"], ["MUSI 1310", "American Music", "Música Americana", 3, "050"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "060"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "060"], ["HIST 2301", "Texas History", "Historia de Texas", 3, "060"], ["HIST 2327", "Mexican American History I (to the United States-Mexico War Era)", "Historia Mexicoamericana I", 3, "060"], ["HIST 2328", "Mexican American History II (from the United States-Mexico War Era)", "Historia Mexicoamericana II", 3, "060"], ["HIST 2381", "African American History I", "Historia Afroamericana I", 3, "060"], ["HIST 2382", "African American History II", "Historia Afroamericana II", 3, "060"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "070"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "070"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "080"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "080"], ["GEOG 1303", "World Regional Geography", "Geografía Regional Mundial", 3, "080"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "080"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "080"], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "090"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "090"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "090"], ["ASTR 1403", "Stars and Galaxies (lecture + lab)", "", 4, "090"], ["ASTR 1404", "Solar System (lecture + lab)", "", 4, "090"], ["BIOL 1308", "Biology for Non-Science Majors I (lecture)", "Biología General I", 3, "090"], ["BIOL 1309", "Biology for Non-Science Majors II (lecture)", "Biología General II", 3, "090"], ["BIOL 1406", "Biology for Science Majors I (lecture + lab)", "", 4, "090"], ["BIOL 1407", "Biology for Science Majors II (lecture + lab)", "", 4, "090"], ["BIOL 2401", "Anatomy & Physiology I (lecture + lab)", "", 4, "090"], ["BIOL 2402", "Anatomy & Physiology II (lecture + lab)", "", 4, "090"], ["CHEM 1405", "Introductory Chemistry I (lecture + lab)", "", 4, "090"], ["CHEM 1411", "General Chemistry I (lecture + lab)", "", 4, "090"], ["CHEM 1412", "General Chemistry II (lecture + lab)", "", 4, "090"], ["CHEM 2423", "Organic Chemistry I (lecture + lab)", "", 4, "090"], ["CHEM 2425", "Organic Chemistry II (lecture + lab)", "", 4, "090"], ["COMM 1307", "Introduction to Mass Communication", "", 3, "090"], ["COMM 2366", "Film Appreciation (title change)", "", 3, "090"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "090"], ["DRAM 2362", "History of the Theater II", "", 3, "090"], ["DRAM 2366", "Film Appreciation", "Apreciación del Cine", 3, "090"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "090"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "090"], ["ENGL 1301", "Composition I", "Composición I", 3, "090"], ["ENGL 1302", "Composition II", "Composición II", 3, "090"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "090"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "090"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "090"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "090"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "090"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "090"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "090"], ["FREN 1411", "Beginning French I (1st semester French, 4 SCH version)", "Francés Básico I", 4, "090"], ["FREN 1412", "Beginning French II (2nd semester French, 4 SCH version)", "Francés Básico II", 4, "090"], ["FREN 2311", "Intermediate French I (3rd semester French)", "", 3, "090"], ["FREN 2312", "Intermediate French II (4th semester French)", "", 3, "090"], ["GEOG 1301", "Physical Geography", "", 3, "090"], ["GEOG 1303", "World Regional Geography", "Geografía Regional Mundial", 3, "090"], ["GEOL 1301", "Earth Sciences for Non-Science Majors I (lecture)", "Ciencias de la Tierra I", 3, "090"], ["GEOL 1303", "Physical Geology (lecture)", "Geología Física", 3, "090"], ["GEOL 1401", "Earth Sciences for Non-Science Majors  I (lecture + lab)", "", 4, "090"], ["GEOL 1403", "Physical Geology (lecture + lab)", "", 4, "090"], ["GEOL 1404", "Historical Geology (lecture + lab)", "", 4, "090"], ["GEOL 1405", "Environmental Science (lecture + lab)", "", 4, "090"], ["GEOL 1445", "Oceanography (lecture + lab)", "", 4, "090"], ["GEOL 1447", "Meteorology (lecture + lab)", "", 4, "090"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "090"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "090"], ["HIST 2301", "Texas History", "Historia de Texas", 3, "090"], ["HIST 2327", "Mexican American History I (to the United States-Mexico War Era)", "Historia Mexicoamericana I", 3, "090"], ["HIST 2328", "Mexican American History II (from the United States-Mexico War Era)", "Historia Mexicoamericana II", 3, "090"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "090"], ["HUMA 1302", "Introduction to Humanities II", "", 3, "090"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "090"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "090"], ["MATH 1325", "Calculus for Business & Social Sciences", "Cálculo para Negocios y Ciencias Sociales", 3, "090"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "090"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "090"], ["MATH 1350", "Mathematics for Teachers I (Fundamentals of Mathematics I)", "", 3, "090"], ["MATH 2412", "Pre-Calculus Math", "Precálculo", 4, "090"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "090"], ["MATH 2414", "Calculus II", "Cálculo II", 4, "090"], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "090"], ["MUSI 1307", "Music Literature", "Literatura Musical", 3, "090"], ["MUSI 1308", "Music Literature I (scheduled for deletion, funding ends August 31, 2019)", "", 3, "090"], ["MUSI 1309", "Music Literature II (scheduled for deletion, funding ends August 31, 2019)", "", 3, "090"], ["MUSI 1310", "American Music", "Música Americana", 3, "090"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "090"], ["PHIL 1304", "Introduction to World Religions", "", 3, "090"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "090"], ["PHYS 1301", "College Physics I (lecture)", "Física I", 3, "090"], ["PHYS 1401", "College Physics I (lecture + lab)", "", 4, "090"], ["PHYS 1402", "College Physics II (lecture + lab)", "", 4, "090"], ["PHYS 1403", "Stars and Galaxies (lecture + lab)", "", 4, "090"], ["PHYS 1404", "Solar System (lecture + lab)", "", 4, "090"], ["PHYS 1410", "Elementary Physics (single-semester course, lecture + lab)", "", 4, "090"], ["PHYS 2425", "University Physics I (lecture + lab)", "", 4, "090"], ["PHYS 2426", "University Physics II (lecture + lab)", "", 4, "090"], ["PSYC 1300", "Learning Framework (3 SCH version)", "", 3, "090"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "090"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "090"], ["SPAN 1411", "Beginning Spanish I (1st semester Spanish, 4 SCH version)", "Español Básico I", 4, "090"], ["SPAN 1412", "Beginning Spanish II (2nd semester Spanish, 4 SCH version)", "Español Básico II", 4, "090"], ["SPAN 2311", "Intermediate Spanish I (3rd semester Spanish)", "", 3, "090"], ["SPAN 2312", "Intermediate Spanish II (4th semester Spanish)", "", 3, "090"], ["SPAN 2313", "Spanish for Native/Heritage Speakers I", "", 3, "090"], ["SPAN 2315", "Spanish for Native/Heritage Speakers II", "", 3, "090"], ["SPCH 1315", "Public Speaking", "Oratoria", 3, "090"], ["SPCH 1318", "Interpersonal Communication", "Comunicación Interpersonal", 3, "090"], ["SPCH 1321", "Business & Professional Communication", "Comunicación Empresarial y Profesional", 3, "090"], ["SPCH 2335", "Argumentation & Debate", "", 3, "090"]];
const COM_RAW = [["ENGL 1301", "Composition I", "Composición I", 3, "010"], ["ENGL 1302", "Composition II", "Composición II", 3, "010"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "010"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "020"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1325", "Calculus for Business & Social Sciences", "Cálculo para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "020"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "020"], ["MATH 2412", "Pre-Calculus Math", "Precálculo", 4, "020"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "020"], ["ASTR 1403", "Stars and Galaxies (lecture + lab)", "", 4, "030"], ["ASTR 1404", "Solar System (lecture + lab)", "", 4, "030"], ["BIOL 1406", "Biology for Science Majors I (lecture + lab)", "", 4, "030"], ["BIOL 1407", "Biology for Science Majors II (lecture + lab)", "", 4, "030"], ["BIOL 1408", "Biology for Non-Science Majors I (lecture + lab)", "", 4, "030"], ["BIOL 1409", "Biology for Non-Science Majors II (lecture + lab)", "", 4, "030"], ["BIOL 2401", "Anatomy & Physiology I (lecture + lab)", "", 4, "030"], ["BIOL 2402", "Anatomy & Physiology II (lecture + lab)", "", 4, "030"], ["CHEM 1405", "Introductory Chemistry I (lecture + lab)", "", 4, "030"], ["CHEM 1406", "Introductory Chemistry I (lecture + lab, allied health emphasis)", "", 4, "030"], ["CHEM 1411", "General Chemistry I (lecture + lab)", "", 4, "030"], ["CHEM 1412", "General Chemistry II (lecture + lab)", "", 4, "030"], ["ENVR 1401", "Environmental Science I (lecture + lab)", "", 4, "030"], ["GEOL 1403", "Physical Geology (lecture + lab)", "", 4, "030"], ["GEOL 1404", "Historical Geology (lecture + lab)", "", 4, "030"], ["GEOL 1405", "Environmental Science (lecture + lab)", "", 4, "030"], ["GEOL 1445", "Oceanography (lecture + lab)", "", 4, "030"], ["GEOL 1447", "Meteorology (lecture + lab)", "", 4, "030"], ["PHYS 1401", "College Physics I (lecture + lab)", "", 4, "030"], ["PHYS 1402", "College Physics II (lecture + lab)", "", 4, "030"], ["PHYS 1403", "Stars and Galaxies (lecture + lab)", "", 4, "030"], ["PHYS 1404", "Solar System (lecture + lab)", "", 4, "030"], ["PHYS 1410", "Elementary Physics (single-semester course, lecture + lab)", "", 4, "030"], ["PHYS 2425", "University Physics I (lecture + lab)", "", 4, "030"], ["PHYS 2426", "University Physics II (lecture + lab)", "", 4, "030"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "040"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "040"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "040"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "040"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "040"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "040"], ["ENGL 2341", "Forms of Literature", "Formas de Literatura", 3, "040"], ["ENGL 2351", "Mexican American Literature", "Literatura Mexicoamericana", 3, "040"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "040"], ["HUMA 1302", "Introduction to Humanities II", "", 3, "040"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "040"], ["PHIL 1304", "Introduction to World Religions", "", 3, "040"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "040"], ["SPAN 2311", "Intermediate Spanish I (3rd semester Spanish)", "", 3, "040"], ["SPAN 2312", "Intermediate Spanish II (4th semester Spanish)", "", 3, "040"], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "050"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "050"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "050"], ["ARTS 1313", "Foundations of Art", "", 3, "050"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "050"], ["DRAM 2366", "Film Appreciation", "Apreciación del Cine", 3, "050"], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "050"], ["MUSI 1307", "Music Literature", "Literatura Musical", 3, "050"], ["MUSI 1310", "American Music", "Música Americana", 3, "050"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "060"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "060"], ["HIST 2301", "Texas History", "Historia de Texas", 3, "060"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "070"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "070"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "080"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "080"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "080"], ["PSYC 2314", "Lifespan Growth & Development", "", 3, "080"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "080"], ["SOCI 1306", "Social Problems", "", 3, "080"], ["EDUC 1300", "Learning Framework", "", 3, "090"], ["PHED 1164", "Introduction to Physical Fitness & Wellness", "Introducción a la Aptitud Física y Bienestar", 1, "090"], ["PSYC 1300", "Learning Framework (3 SCH version)", "", 3, "090"]];
const LEE_RAW = [["ENGL 1301", "Composition I", "Composición I", 3, "010"], ["ENGL 1302", "Composition II", "Composición II", 3, "010"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "010"], ["BUSI 2305", "Business Statistics", "", 3, "020"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "020"], ["MATH 1316", "Plane Trigonometry", "Trigonometría Plana", 3, "020"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "020"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "020"], ["MATH 2412", "Pre-Calculus Math", "Precálculo", 4, "020"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "020"], ["BIOL 1308", "Biology for Non-Science Majors I (lecture)", "Biología General I", 3, "030"], ["BIOL 1309", "Biology for Non-Science Majors II (lecture)", "Biología General II", 3, "030"], ["BIOL 1322", "Nutrition & Diet Therapy", "", 3, "030"], ["BIOL 1406", "Biology for Science Majors I (lecture + lab)", "", 4, "030"], ["BIOL 1407", "Biology for Science Majors II (lecture + lab)", "", 4, "030"], ["BIOL 1408", "Biology for Non-Science Majors I (lecture + lab)", "", 4, "030"], ["BIOL 1409", "Biology for Non-Science Majors II (lecture + lab)", "", 4, "030"], ["BIOL 1411", "General Botany (lecture + lab)", "", 4, "030"], ["BIOL 1413", "General Zoology (lecture + lab)", "", 4, "030"], ["BIOL 2401", "Anatomy & Physiology I (lecture + lab)", "", 4, "030"], ["BIOL 2402", "Anatomy & Physiology II (lecture + lab)", "", 4, "030"], ["BIOL 2404", "Anatomy & Physiology (specialized, single-semester course, lecture + lab)", "", 4, "030"], ["BIOL 2416", "Genetics (lecture + lab)", "", 4, "030"], ["BIOL 2421", "Microbiology for Science Majors (lecture + lab)", "", 4, "030"], ["CHEM 1405", "Introductory Chemistry I (lecture + lab)", "", 4, "030"], ["CHEM 1411", "General Chemistry I (lecture + lab)", "", 4, "030"], ["CHEM 1412", "General Chemistry II (lecture + lab)", "", 4, "030"], ["CHEM 2423", "Organic Chemistry I (lecture + lab)", "", 4, "030"], ["CHEM 2425", "Organic Chemistry II (lecture + lab)", "", 4, "030"], ["ENVR 1401", "Environmental Science I (lecture + lab)", "", 4, "030"], ["ENVR 1402", "Environmental Science II (lecture + lab)", "", 4, "030"], ["GEOL 1347", "Meteorology (lecture)", "", 3, "030"], ["GEOL 1403", "Physical Geology (lecture + lab)", "", 4, "030"], ["GEOL 1404", "Historical Geology (lecture + lab)", "", 4, "030"], ["GEOL 1405", "Environmental Science (lecture + lab)", "", 4, "030"], ["GEOL 1447", "Meteorology (lecture + lab)", "", 4, "030"], ["PHYS 1317", "Physical Science II (lecture)", "", 3, "030"], ["PHYS 1401", "College Physics I (lecture + lab)", "", 4, "030"], ["PHYS 1402", "College Physics II (lecture + lab)", "", 4, "030"], ["PHYS 1403", "Stars and Galaxies (lecture + lab)", "", 4, "030"], ["PHYS 1404", "Solar System (lecture + lab)", "", 4, "030"], ["PHYS 1405", "Elementary Physics I (lecture + lab)", "", 4, "030"], ["PHYS 1407", "Elementary Physics II (lecture + lab)", "", 4, "030"], ["PHYS 1415", "Physical Science I (lecture + lab)", "", 4, "030"], ["PHYS 1417", "Physical Science II (lecture + lab)", "", 4, "030"], ["PHYS 2425", "University Physics I (lecture + lab)", "", 4, "030"], ["PHYS 2426", "University Physics II (lecture + lab)", "", 4, "030"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "040"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "040"], ["ENGL 2326", "American Literature (single-semester course)", "", 3, "040"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "040"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "040"], ["ENGL 2331", "World Literature (single-semester course)", "", 3, "040"], ["ENGL 2341", "Forms of Literature", "Formas de Literatura", 3, "040"], ["ENGL 2351", "Mexican American Literature", "Literatura Mexicoamericana", 3, "040"], ["HIST 2321", "World Civilizations I", "Civilización Mundial I", 3, "040"], ["HIST 2322", "World Civilizations II", "Civilización Mundial II", 3, "040"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "040"], ["HUMA 1305", "Introduction to Mexican American Studies", "", 3, "040"], ["HUMA 2319", "American Minority Studies", "", 3, "040"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "040"], ["PHIL 1304", "Introduction to World Religions", "", 3, "040"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "040"], ["SPAN 2311", "Intermediate Spanish I (3rd semester Spanish)", "", 3, "040"], ["SPAN 2312", "Intermediate Spanish II (4th semester Spanish)", "", 3, "040"], ["SPAN 2313", "Spanish for Native/Heritage Speakers I", "", 3, "040"], ["SPAN 2315", "Spanish for Native/Heritage Speakers II", "", 3, "040"], ["ARCH 1311", "Introduction to Architecture (3 SCH version)", "", 3, "050"], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "050"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "050"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "050"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "050"], ["DRAM 2366", "Film Appreciation", "Apreciación del Cine", 3, "050"], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "050"], ["MUSI 1310", "American Music", "Música Americana", 3, "050"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "060"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "060"], ["HIST 2301", "Texas History", "Historia de Texas", 3, "060"], ["HIST 2327", "Mexican American History I (to the United States-Mexico War Era)", "Historia Mexicoamericana I", 3, "060"], ["HIST 2328", "Mexican American History II (from the United States-Mexico War Era)", "Historia Mexicoamericana II", 3, "060"], ["HIST 2381", "African American History I", "Historia Afroamericana I", 3, "060"], ["HIST 2382", "African American History II", "Historia Afroamericana II", 3, "060"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "070"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "070"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "080"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "080"], ["GEOG 1303", "World Regional Geography", "Geografía Regional Mundial", 3, "080"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "080"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "080"], ["BCIS 1305", "Business Computer Applications (3 SCH version)", "", 3, "090"], ["EDUC 1200", "Learning Framework (2 SCH version)", "", 2, "090"], ["PHED 1164", "Introduction to Physical Fitness & Wellness", "Introducción a la Aptitud Física y Bienestar", 1, "090"], ["PHED 1304", "Personal/Community Health", "", 3, "090"], ["PHED 1306", "First Aid, CPR, and Safety Practices", "", 3, "090"], ["SPCH 1311", "Introduction to Speech Communication", "Introducción a la Comunicación Oral", 3, "090"], ["SPCH 1315", "Public Speaking", "Oratoria", 3, "090"], ["SPCH 1318", "Interpersonal Communication", "Comunicación Interpersonal", 3, "090"], ["SPCH 1321", "Business & Professional Communication", "Comunicación Empresarial y Profesional", 3, "090"]];
const DELMAR_RAW = [["ENGL 1301", "Composition I", "Composición I", 3, "010"], ["ENGL 1302", "Composition II", "Composición II", 3, "010"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "010"], ["SPCH 1311", "Introduction to Speech Communication", "Introducción a la Comunicación Oral", 3, "010"], ["SPCH 1315", "Public Speaking", "Oratoria", 3, "010"], ["SPCH 1321", "Business & Professional Communication", "Comunicación Empresarial y Profesional", 3, "010"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "020"], ["MATH 1316", "Plane Trigonometry", "Trigonometría Plana", 3, "020"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1325", "Calculus for Business & Social Sciences", "Cálculo para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "020"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "020"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "020"], ["BIOL 1308", "Biology for Non-Science Majors I (lecture)", "Biología General I", 3, "030"], ["BIOL 1309", "Biology for Non-Science Majors II (lecture)", "Biología General II", 3, "030"], ["BIOL 1406", "Biology for Science Majors I (lecture + lab)", "", 4, "030"], ["BIOL 1407", "Biology for Science Majors II (lecture + lab)", "", 4, "030"], ["BIOL 1408", "Biology for Non-Science Majors I (lecture + lab)", "", 4, "030"], ["BIOL 1409", "Biology for Non-Science Majors II (lecture + lab)", "", 4, "030"], ["BIOL 1414", "Introduction to Biotechnology I", "", 4, "030"], ["BIOL 2401", "Anatomy & Physiology I (lecture + lab)", "", 4, "030"], ["BIOL 2402", "Anatomy & Physiology II (lecture + lab)", "", 4, "030"], ["BIOL 2404", "Anatomy & Physiology (specialized, single-semester course, lecture + lab)", "", 4, "030"], ["CHEM 1305", "Introductory Chemistry I (lecture)", "Química Introductoria I", 3, "030"], ["CHEM 1307", "Introductory Chemistry II (lecture)", "", 3, "030"], ["CHEM 1405", "Introductory Chemistry I (lecture + lab)", "", 4, "030"], ["CHEM 1406", "Introductory Chemistry I (lecture + lab, allied health emphasis)", "", 4, "030"], ["CHEM 1407", "Introductory Chemistry II (lecture + lab)", "", 4, "030"], ["CHEM 1409", "General Chemistry for Engineering Majors (lecture + lab)", "", 4, "030"], ["CHEM 1411", "General Chemistry I (lecture + lab)", "", 4, "030"], ["CHEM 1412", "General Chemistry II (lecture + lab)", "", 4, "030"], ["GEOL 1301", "Earth Sciences for Non-Science Majors I (lecture)", "Ciencias de la Tierra I", 3, "030"], ["GEOL 1303", "Physical Geology (lecture)", "Geología Física", 3, "030"], ["GEOL 1304", "Historical Geology (lecture)", "Geología Histórica", 3, "030"], ["GEOL 1345", "Oceanography (lecture)", "", 3, "030"], ["GEOL 1404", "Historical Geology (lecture + lab)", "", 4, "030"], ["PHYS 1303", "Stars And Galaxies", "", 3, "030"], ["PHYS 1305", "Elementary Physics I (lecture)", "", 3, "030"], ["PHYS 1401", "College Physics I (lecture + lab)", "", 4, "030"], ["PHYS 1402", "College Physics II (lecture + lab)", "", 4, "030"], ["PHYS 2425", "University Physics I (lecture + lab)", "", 4, "030"], ["PHYS 2426", "University Physics II (lecture + lab)", "", 4, "030"], ["COMM 2300", "Media Literacy", "", 3, "040"], ["ENGL 2321", "Writing, Tech And Soc Media", "", 3, "040"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "040"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "040"], ["ENGL 2326", "American Literature (single-semester course)", "", 3, "040"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "040"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "040"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "040"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "040"], ["ENGL 2341", "Forms of Literature", "Formas de Literatura", 3, "040"], ["ENGL 2351", "Mexican American Literature", "Literatura Mexicoamericana", 3, "040"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "040"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "040"], ["PHIL 2307", "Introduction to Social & Political Philosophy", "", 3, "040"], ["PHIL 2321", "Philosophy of Religion", "", 3, "040"], ["ARCH 1301", "Architectural History I", "", 3, "050"], ["ARCH 1302", "Architectural History II", "", 3, "050"], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "050"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "050"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "050"], ["ARTS 1311", "Design I   (2-dimensional)", "", 3, "050"], ["ARTS 1312", "Design II (3-dimensional)", "", 3, "050"], ["ARTS 1316", "Drawing I", "", 3, "050"], ["ARTS 1325", "Drawing & Painting", "", 3, "050"], ["ARTS 2313", "Graphic Design (title change)", "", 3, "050"], ["ARTS 2316", "Painting I", "", 3, "050"], ["ARTS 2323", "Life Drawing", "", 3, "050"], ["ARTS 2326", "Sculpture", "", 3, "050"], ["ARTS 2333", "Printmaking", "", 3, "050"], ["ARTS 2346", "Ceramics I", "", 3, "050"], ["ARTS 2348", "Digital Media", "", 3, "050"], ["ARTS 2356", "Photography I (fine arts emphasis)", "", 3, "050"], ["ARTS 2357", "Photography II (fine arts emphasis)", "", 3, "050"], ["COMM 2366", "Film Appreciation (title change)", "", 3, "050"], ["DANC 2303", "Dance Appreciation", "Apreciación de la Danza", 3, "050"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "050"], ["DRAM 1351", "Acting I", "", 3, "050"], ["DRAM 2361", "History of the Theater I", "", 3, "050"], ["DRAM 2366", "Film Appreciation", "Apreciación del Cine", 3, "050"], ["ENGL 2307", "Intro To Drama", "", 3, "050"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "050"], ["HUMA 1305", "Introduction to Mexican American Studies", "", 3, "050"], ["HUMA 1311", "Mexican American Fine Arts Appreciation", "", 3, "050"], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "050"], ["MUSI 1307", "Music Literature", "Literatura Musical", 3, "050"], ["MUSI 1310", "American Music", "Música Americana", 3, "050"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "060"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "060"], ["HIST 2301", "Texas History", "Historia de Texas", 3, "060"], ["HIST 2327", "Mexican American History I (to the United States-Mexico War Era)", "Historia Mexicoamericana I", 3, "060"], ["HIST 2328", "Mexican American History II (from the United States-Mexico War Era)", "Historia Mexicoamericana II", 3, "060"], ["HIST 2381", "African American History I", "Historia Afroamericana I", 3, "060"], ["HIST 2382", "African American History II", "Historia Afroamericana II", 3, "060"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "070"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "070"], ["ANTH 2302", "Introduction to Archeology", "Introducción a la Arqueología", 3, "080"], ["ANTH 2346", "General Anthropology", "Antropología General", 3, "080"], ["ARCH 1311", "Introduction to Architecture (3 SCH version)", "", 3, "080"], ["COMM 1307", "Introduction to Mass Communication", "", 3, "080"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "080"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "080"], ["GEOG 1303", "World Regional Geography", "Geografía Regional Mundial", 3, "080"], ["GOVT 2311", "Mexican American and Latinx Politics", "", 3, "080"], ["HIST 2311", "Western Civilization I", "Civilización Occidental I", 3, "080"], ["HIST 2312", "Western Civilization II", "Civilización Occidental II", 3, "080"], ["HIST 2321", "World Civilizations I", "Civilización Mundial I", 3, "080"], ["HIST 2322", "World Civilizations II", "Civilización Mundial II", 3, "080"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "080"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "080"], ["SOCI 1306", "Social Problems", "", 3, "080"], ["SOCI 2301", "Marriage & the Family", "", 3, "080"], ["SOCI 2319", "Minority Studies", "Estudios de Minorías", 3, "080"], ["SOCW 2361", "Intro To Soc Work", "", 3, "080"], ["TECA 1354", "Child Growth & Development", "Crecimiento y Desarrollo Infantil", 3, "080"], ["ARCH 1301", "Architectural History I", "", 3, "090"], ["ARCH 1302", "Architectural History II", "", 3, "090"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "090"], ["BIOL 1108", "Biology for Non-Science Majors Laboratory I (lab)", "Biología General I (laboratorio)", 1, "090"], ["BIOL 1109", "Biology for Non-Science Majors Laboratory II (lab)", "Biología General II (laboratorio)", 1, "090"], ["CHEM 1105", "Introductory Chemistry Laboratory I (lab)", "Química Introductoria I (laboratorio)", 1, "090"], ["CHEM 1107", "Introductory Chemistry Laboratory II (lab)", "", 1, "090"], ["CHEM 1406", "Introductory Chemistry I (lecture + lab, allied health emphasis)", "", 4, "090"], ["CHEM 1411", "General Chemistry I (lecture + lab)", "", 4, "090"], ["COMM 2300", "Media Literacy", "", 3, "090"], ["COMM 2366", "Film Appreciation (title change)", "", 3, "090"], ["DANC 2303", "Dance Appreciation", "Apreciación de la Danza", 3, "090"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "090"], ["DRAM 2361", "History of the Theater I", "", 3, "090"], ["DRAM 2366", "Film Appreciation", "Apreciación del Cine", 3, "090"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "090"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "090"], ["EDUC 1100", "Learning Framework (1 SCH version)", "Marco de Aprendizaje", 1, "090"], ["ENGL 1301", "Composition I", "Composición I", 3, "090"], ["ENGL 1302", "Composition II", "Composición II", 3, "090"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "090"], ["ENGL 2321", "Writing, Tech And Soc Media", "", 3, "090"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "090"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "090"], ["ENGL 2326", "American Literature (single-semester course)", "", 3, "090"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "090"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "090"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "090"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "090"], ["ENGL 2341", "Forms of Literature", "Formas de Literatura", 3, "090"], ["ENGL 2351", "Mexican American Literature", "Literatura Mexicoamericana", 3, "090"], ["GEOG 1303", "World Regional Geography", "Geografía Regional Mundial", 3, "090"], ["GEOL 1103", "Physical Geology  (lab)", "Geología Física (laboratorio)", 1, "090"], ["GEOL 1104", "Historical Geology (lab)", "Geología Histórica (laboratorio)", 1, "090"], ["MATH 1316", "Plane Trigonometry", "Trigonometría Plana", 3, "090"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "090"], ["MATH 1325", "Calculus for Business & Social Sciences", "Cálculo para Negocios y Ciencias Sociales", 3, "090"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "090"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "090"], ["PHED 1164", "Introduction to Physical Fitness & Wellness", "Introducción a la Aptitud Física y Bienestar", 1, "090"], ["PHED 1304", "Personal/Community Health", "", 3, "090"], ["PHYS 2425", "University Physics I (lecture + lab)", "", 4, "090"], ["PHYS 2426", "University Physics II (lecture + lab)", "", 4, "090"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "090"], ["SOCI 2319", "Minority Studies", "Estudios de Minorías", 3, "090"], ["SPCH 1311", "Introduction to Speech Communication", "Introducción a la Comunicación Oral", 3, "090"], ["SPCH 1315", "Public Speaking", "Oratoria", 3, "090"], ["SPCH 1321", "Business & Professional Communication", "Comunicación Empresarial y Profesional", 3, "090"]];
const SWTC_RAW = [["ENGL 1301", "Composition I", "Composición I", 3, "010"], ["ENGL 1302", "Composition II", "Composición II", 3, "010"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "010"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "020"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "020"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "020"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "020"], ["BIOL 1306", "Biology for Science Majors I (lecture)", "Biología para Ciencias I", 3, "030"], ["BIOL 1307", "Biology for Science Majors II (lecture)", "Biología para Ciencias II", 3, "030"], ["BIOL 1308", "Biology for Non-Science Majors I (lecture)", "Biología General I", 3, "030"], ["BIOL 1309", "Biology for Non-Science Majors II (lecture)", "Biología General II", 3, "030"], ["BIOL 2401", "Anatomy & Physiology I (lecture + lab)", "", 4, "030"], ["BIOL 2402", "Anatomy & Physiology II (lecture + lab)", "", 4, "030"], ["CHEM 1311", "General Chemistry I (lecture)", "Química General I", 3, "030"], ["CHEM 1312", "General Chemistry II (lecture)", "Química General II", 3, "030"], ["PHYS 1301", "College Physics I (lecture)", "Física I", 3, "030"], ["PHYS 1302", "College Physics II (lecture)", "Física II", 3, "030"], ["PHYS 2325", "University Physics I (lecture)", "Física Universitaria I", 3, "030"], ["PHYS 2326", "University Physics II (lecture)", "Física Universitaria II", 3, "030"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "040"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "040"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "040"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "040"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "040"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "040"], ["ENGL 2351", "Mexican American Literature", "Literatura Mexicoamericana", 3, "040"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "040"], ["HUMA 1302", "Introduction to Humanities II", "", 3, "040"], ["HUMA 1311", "Mexican American Fine Arts Appreciation", "", 3, "040"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "040"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "040"], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "050"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "050"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "050"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "050"], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "050"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "060"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "060"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "070"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "070"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "080"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "080"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "080"], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "090"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "090"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "090"], ["BCIS 1305", "Business Computer Applications (3 SCH version)", "", 3, "090"], ["BIOL 1306", "Biology for Science Majors I (lecture)", "Biología para Ciencias I", 3, "090"], ["BIOL 1307", "Biology for Science Majors II (lecture)", "Biología para Ciencias II", 3, "090"], ["BIOL 1308", "Biology for Non-Science Majors I (lecture)", "Biología General I", 3, "090"], ["BIOL 1309", "Biology for Non-Science Majors II (lecture)", "Biología General II", 3, "090"], ["BIOL 2401", "Anatomy & Physiology I (lecture + lab)", "", 4, "090"], ["BIOL 2402", "Anatomy & Physiology II (lecture + lab)", "", 4, "090"], ["CHEM 1311", "General Chemistry I (lecture)", "Química General I", 3, "090"], ["CHEM 1312", "General Chemistry II (lecture)", "Química General II", 3, "090"], ["COSC 1301", "Introduction to Computing (3 SCH version)", "", 3, "090"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "090"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "090"], ["ENGL 1302", "Composition II", "Composición II", 3, "090"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "090"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "090"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "090"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "090"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "090"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "090"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "090"], ["ENGL 2351", "Mexican American Literature", "Literatura Mexicoamericana", 3, "090"], ["HECO 1322", "Nutrition & Diet Therapy", "", 3, "090"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "090"], ["HUMA 1302", "Introduction to Humanities II", "", 3, "090"], ["HUMA 1311", "Mexican American Fine Arts Appreciation", "", 3, "090"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "090"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "090"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "090"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "090"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "090"], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "090"], ["PHED 1304", "Personal/Community Health", "", 3, "090"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "090"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "090"], ["PHYS 1301", "College Physics I (lecture)", "Física I", 3, "090"], ["PHYS 1302", "College Physics II (lecture)", "Física II", 3, "090"], ["PHYS 2325", "University Physics I (lecture)", "Física Universitaria I", 3, "090"], ["PHYS 2326", "University Physics II (lecture)", "Física Universitaria II", 3, "090"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "090"], ["PSYC 2314", "Lifespan Growth & Development", "", 3, "090"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "090"], ["SPCH 1311", "Introduction to Speech Communication", "Introducción a la Comunicación Oral", 3, "090"], ["SPCH 1315", "Public Speaking", "Oratoria", 3, "090"], ["SPCH 1321", "Business & Professional Communication", "Comunicación Empresarial y Profesional", 3, "090"]];
const SULROSS_RAW = [["ENGL 1301", "Composition I", "Composición I", 3, "010"], ["ENGL 1302", "Composition II", "Composición II", 3, "010"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "010"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "020"], ["MATH 1316", "Plane Trigonometry", "Trigonometría Plana", 3, "020"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "020"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "020"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "020"], ["AGRI 1419", "Introductory Animal Science", "", 4, "030"], ["ASTR 1303", "Stars and Galaxies (lecture)", "Estrellas y Galaxias", 3, "030"], ["ASTR 1304", "Solar System (lecture)", "El Sistema Solar", 3, "030"], ["BIOL 1306", "Biology for Science Majors I (lecture)", "Biología para Ciencias I", 3, "030"], ["BIOL 1307", "Biology for Science Majors II (lecture)", "Biología para Ciencias II", 3, "030"], ["BIOL 1311", "General Botany", "", 3, "030"], ["BIOL 1313", "General Zoology", "", 3, "030"], ["BIOL 2301", "Anatomy & Physiology I (lecture)", "Anatomía y Fisiología I", 3, "030"], ["BIOL 2302", "Anatomy & Physiology II (lecture)", "Anatomía y Fisiología II", 3, "030"], ["BIOL 2321", "Microbiology", "", 3, "030"], ["CHEM 1311", "General Chemistry I (lecture)", "Química General I", 3, "030"], ["CHEM 1312", "General Chemistry II (lecture)", "Química General II", 3, "030"], ["GEOL 1303", "Physical Geology (lecture)", "Geología Física", 3, "030"], ["GEOL 1304", "Historical Geology (lecture)", "Geología Histórica", 3, "030"], ["GEOL 1305", "Environmental Science (lecture)", "", 3, "030"], ["HORT 1301", "Horticulture", "", 3, "030"], ["IT 1309", "Power Technology", "", 3, "030"], ["NRM 2303", "Prin Conservation Ecology", "", 3, "030"], ["NRM 2305", "Soils", "", 3, "030"], ["PHYS 1301", "College Physics I (lecture)", "Física I", 3, "030"], ["PHYS 1302", "College Physics II (lecture)", "Física II", 3, "030"], ["ANTH 2302", "Introduction to Archeology", "Introducción a la Arqueología", 3, "040"], ["ENG 2315", "Environmental Literature", "", 3, "040"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "040"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "040"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "040"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "040"], ["ENGL 2331", "World Literature (single-semester course)", "", 3, "040"], ["ENGL 2341", "Forms of Literature", "Formas de Literatura", 3, "040"], ["HIST 2311", "Western Civilization I", "Civilización Occidental I", 3, "040"], ["HIST 2312", "Western Civilization II", "Civilización Occidental II", 3, "040"], ["HUMA 1305", "Introduction to Mexican American Studies", "", 3, "040"], ["MUSI 1310", "American Music", "Música Americana", 3, "040"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "040"], ["PHIL 2303", "Introduction to Formal Logic", "", 3, "040"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "040"], ["PHIL 2307", "Introduction to Social & Political Philosophy", "", 3, "040"], ["PHIL 2316", "Classical Philosophy", "", 3, "040"], ["PHIL 2321", "Philosophy of Religion", "", 3, "040"], ["SPAN 1411", "Beginning Spanish I (1st semester Spanish, 4 SCH version)", "Español Básico I", 4, "040"], ["SPAN 1412", "Beginning Spanish II (2nd semester Spanish, 4 SCH version)", "Español Básico II", 4, "040"], ["SPAN 2311", "Intermediate Spanish I (3rd semester Spanish)", "", 3, "040"], ["SPAN 2312", "Intermediate Spanish II (4th semester Spanish)", "", 3, "040"], ["WS 2301", "Women's & Gender Studies", "", 3, "040"], ["WS 2302", "Intro Mas/Gend Studies", "", 3, "040"], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "050"], ["ARTS 2356", "Photography I (fine arts emphasis)", "", 3, "050"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "050"], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "050"], ["MUSI 1308", "Music Literature I (scheduled for deletion, funding ends August 31, 2019)", "", 3, "050"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "060"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "060"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "070"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "070"], ["ANSC 2312", "Current Issues In Ag", "", 3, "080"], ["ANTH 2351", "Cultural Anthropology", "Antropología Cultural", 3, "080"], ["CRIJ 1301", "Introduction to Criminal Justice", "Introducción a la Justicia Penal", 3, "080"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "080"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "080"], ["EDUA 2303", "Trends In Education", "", 3, "080"], ["GEOG 1303", "World Regional Geography", "Geografía Regional Mundial", 3, "080"], ["GEOG 2302", "Geography Of North America", "", 3, "080"], ["HSCI 1302", "Intro To Health Sciences", "", 3, "080"], ["IT 2308", "Intro To The Built Environment", "", 3, "080"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "080"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "080"], ["ANTH 2302", "Introduction to Archeology", "Introducción a la Arqueología", 3, "090"], ["ANTH 2351", "Cultural Anthropology", "Antropología Cultural", 3, "090"], ["COMM 1310", "Fundamentals Of Communication", "", 3, "090"], ["COMM 2311", "Media Writing", "", 3, "090"], ["ENG 2315", "Environmental Literature", "", 3, "090"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "090"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "090"], ["ENGL 2331", "World Literature (single-semester course)", "", 3, "090"], ["ENGL 2341", "Forms of Literature", "Formas de Literatura", 3, "090"], ["HSCI 1301", "Medical Terminology", "", 3, "090"], ["IT 2308", "Intro To The Built Environment", "", 3, "090"], ["SPAN 1411", "Beginning Spanish I (1st semester Spanish, 4 SCH version)", "Español Básico I", 4, "090"], ["SPAN 1412", "Beginning Spanish II (2nd semester Spanish, 4 SCH version)", "Español Básico II", 4, "090"], ["SPAN 2311", "Intermediate Spanish I (3rd semester Spanish)", "", 3, "090"], ["SPAN 2312", "Intermediate Spanish II (4th semester Spanish)", "", 3, "090"], ["SPCH 1315", "Public Speaking", "Oratoria", 3, "090"], ["SPCH 1321", "Business & Professional Communication", "Comunicación Empresarial y Profesional", 3, "090"]];
const TAMIU_RAW = [["ENGL 1301", "Composition I", "Composición I", 3, "010"], ["ENGL 1302", "Composition II", "Composición II", 3, "010"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "010"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "020"], ["MATH 1316", "Plane Trigonometry", "Trigonometría Plana", 3, "020"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "020"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "020"], ["MATH 2412", "Pre-Calculus Math", "Precálculo", 4, "020"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "020"], ["BIOL 1306", "Biology for Science Majors I (lecture)", "Biología para Ciencias I", 3, "030"], ["BIOL 1308", "Biology for Non-Science Majors I (lecture)", "Biología General I", 3, "030"], ["BIOL 1309", "Biology for Non-Science Majors II (lecture)", "Biología General II", 3, "030"], ["BIOL 1311", "Principles Of Biology II", "", 3, "030"], ["BIOL 2301", "Anatomy & Physiology I (lecture)", "Anatomía y Fisiología I", 3, "030"], ["BIOL 2302", "Anatomy & Physiology II (lecture)", "Anatomía y Fisiología II", 3, "030"], ["CHEM 1305", "Introductory Chemistry I (lecture)", "Química Introductoria I", 3, "030"], ["CHEM 1311", "General Chemistry I (lecture)", "Química General I", 3, "030"], ["GEOL 1301", "Earth Sciences for Non-Science Majors I (lecture)", "Ciencias de la Tierra I", 3, "030"], ["GEOL 1303", "Physical Geology (lecture)", "Geología Física", 3, "030"], ["GEOL 1305", "Environmental Science (lecture)", "", 3, "030"], ["GEOL 1347", "Meteorology (lecture)", "", 3, "030"], ["PHYS 1303", "Stars And Galaxies", "", 3, "030"], ["PHYS 1315", "Survey Physical Science", "", 3, "030"], ["PHYS 2325", "University Physics I (lecture)", "Física Universitaria I", 3, "030"], ["PHYS 2326", "University Physics II (lecture)", "Física Universitaria II", 3, "030"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "040"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "040"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "040"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "040"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "040"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "040"], ["ENGL 2342", "Literature&Film", "", 3, "040"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "040"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "040"], ["SPAN 2324", "Intro To The Hispanic World", "", 3, "040"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "050"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "050"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "050"], ["MUSI 1306", "Music Appreciation", "Apreciación Musical", 3, "050"], ["MUSI 1310", "American Music", "Música Americana", 3, "050"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "060"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "060"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "070"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "070"], ["ANTH 2346", "General Anthropology", "Antropología General", 3, "080"], ["BUSI 1301", "Business Principles", "", 3, "080"], ["CRIJ 1301", "Introduction to Criminal Justice", "Introducción a la Justicia Penal", 3, "080"], ["ECON 1301", "Introduction To Economics", "", 3, "080"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "080"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "080"], ["GEOG 1303", "World Regional Geography", "Geografía Regional Mundial", 3, "080"], ["GOVT 2301", "Foundations Of Leadership", "", 3, "080"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "080"], ["PSYC 2314", "Lifespan Growth & Development", "", 3, "080"], ["SOCI 1306", "Social Problems", "", 3, "080"], ["BIOL 1108", "Biology for Non-Science Majors Laboratory I (lab)", "Biología General I (laboratorio)", 1, "090"], ["BIOL 1109", "Biology for Non-Science Majors Laboratory II (lab)", "Biología General II (laboratorio)", 1, "090"], ["BIOL 1111", "Principles Of Biology II-Lab", "", 1, "090"], ["BIOL 1306", "Biology for Science Majors I (lecture)", "Biología para Ciencias I", 1, "090"], ["BIOL 2101", "Anatomy & Physiology I (lab)", "Anatomía y Fisiología I (laboratorio)", 1, "090"], ["BIOL 2102", "Anatomy & Physiology II (lab)", "Anatomía y Fisiología II (laboratorio)", 1, "090"], ["CHEM 1105", "Introductory Chemistry Laboratory I (lab)", "Química Introductoria I (laboratorio)", 1, "090"], ["CHEM 1111", "General Chemistry I (lab)", "Química General I (laboratorio)", 1, "090"], ["ENGL 2389", "Signature Course", "", 3, "090"], ["GEOL 1101", "Earth Sciences for Non-Science Majors I (lab)", "Ciencias de la Tierra I (laboratorio)", 1, "090"], ["GEOL 1103", "Physical Geology  (lab)", "Geología Física (laboratorio)", 1, "090"], ["GEOL 1105", "Environmental Science (lab)", "", 1, "090"], ["GEOL 1147", "Atmospheric Science-Lab", "", 1, "090"], ["PHYS 1103", "Principles Of Astronomy Lab", "", 1, "090"], ["PHYS 1115", "Survey Phys Science Lab", "", 1, "090"], ["PHYS 2125", "University Physics Laboratory I (lab)", "Física Universitaria I (laboratorio)", 1, "090"], ["PHYS 2126", "University Physics Laboratory II (lab)", "Física Universitaria II (laboratorio)", 1, "090"], ["PSYC 1100", "Learning Frameworks", "", 1, "090"], ["PSYC 1200", "Learn A Global Context I", "", 2, "090"]];
const UH_RAW = [["ENGL 1301", "Composition I", "Composición I", 3, "010"], ["ENGL 1302", "Composition II", "Composición II", 3, "010"], ["ENGL 1370", "Composition II-Honors", "", 3, "010"], ["ENGL 2361", "Western World Lit II--Honors", "", 3, "010"], ["BUSI 2305", "Business Statistics", "", 3, "020"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "020"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1325", "Calculus for Business & Social Sciences", "Cálculo para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "020"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "020"], ["MATH 1351", "Mathematics for Teachers II  (Fundamentals of Mathematics II)", "", 3, "020"], ["MATH 2312", "Precalculus", "", 3, "020"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "020"], ["MATH 2450", "Accelerated Calculus I", "", 4, "020"], ["ANTH 2301", "Physical Anthropology (lecture)", "", 3, "030"], ["BIOL 1305", "Human Biology", "", 3, "030"], ["BIOL 1306", "Biology for Science Majors I (lecture)", "Biología para Ciencias I", 3, "030"], ["BIOL 1307", "Biology for Science Majors II (lecture)", "Biología para Ciencias II", 3, "030"], ["BIOL 1308", "Biology for Non-Science Majors I (lecture)", "Biología General I", 3, "030"], ["BIOL 1309", "Biology for Non-Science Majors II (lecture)", "Biología General II", 3, "030"], ["BIOL 1319", "Human Genetics And Society", "", 3, "030"], ["BIOL 2315", "Biology Of Food", "", 3, "030"], ["CHEM 1305", "Introductory Chemistry I (lecture)", "Química Introductoria I", 3, "030"], ["CHEM 1311", "General Chemistry I (lecture)", "Química General I", 3, "030"], ["CHEM 1312", "General Chemistry II (lecture)", "Química General II", 3, "030"], ["CHEM 1321", "Honors Fund. Of Chem 1", "", 3, "030"], ["CHEM 1322", "Honors Fund Of Chem 2", "", 3, "030"], ["GEOL 1302", "Intro To Global Climate Change", "", 3, "030"], ["GEOL 1303", "Physical Geology (lecture)", "Geología Física", 3, "030"], ["GEOL 1304", "Historical Geology (lecture)", "Geología Histórica", 3, "030"], ["GEOL 1340", "Earth Systems", "", 3, "030"], ["GEOL 1345", "Oceanography (lecture)", "", 3, "030"], ["GEOL 1347", "Meteorology (lecture)", "", 3, "030"], ["GEOL 1370", "Natural Disasters", "", 3, "030"], ["NUTR 1332", "Fundamentals Human Nutrition", "", 3, "030"], ["NUTR 2332", "Intro To Human Nutrition", "", 3, "030"], ["PHYS 1301", "College Physics I (lecture)", "Física I", 3, "030"], ["PHYS 1302", "College Physics II (lecture)", "Física II", 3, "030"], ["PHYS 1303", "Stars And Galaxies", "", 3, "030"], ["PHYS 1304", "Solar System", "", 3, "030"], ["PHYS 2325", "University Physics I (lecture)", "Física Universitaria I", 3, "030"], ["PHYS 2326", "University Physics II (lecture)", "Física Universitaria II", 3, "030"], ["0 0", "Intro To Fiction", "", 3, "040"], ["AAS 2320", "Intro To African American Stdy", "", 3, "040"], ["AAS 2330", "Black Liberation Theology", "", 3, "040"], ["ARAB 3340", "Modern & Rational In Islam", "", 3, "040"], ["ARTH 1300", "Art And Our Visual World", "", 3, "040"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "040"], ["CHIN 3344", "Global Chinese Literature", "", 3, "040"], ["CHIN 3352", "Chin Cul & Soc Thru Mod Lit", "", 3, "040"], ["CHIN 3360", "A Look Into Modern China", "", 3, "040"], ["CLAS 3307", "Greek & Roman Myths Of Heroes", "", 3, "040"], ["CLAS 3308", "Myths & Cult Of Ancient Gods", "", 3, "040"], ["CLAS 3366", "Greek Art And Archaeology", "", 3, "040"], ["CLAS 3374", "Women In The Ancient World", "", 3, "040"], ["ENGL 2306", "Intro To Poetry", "", 3, "040"], ["ENGL 2308", "Studies In Non-Fiction Writing", "", 3, "040"], ["ENGL 2315", "Literature And Film", "", 3, "040"], ["ENGL 2316", "Literature And Culture", "", 3, "040"], ["ENGL 2324", "Writing The Arts", "", 3, "040"], ["ENGL 2325", "Lit Trad Of Nonwestern World", "", 3, "040"], ["ENGL 2340", "Cosmic Narratives", "", 3, "040"], ["ENGL 3306", "Shakespeare-Major Works", "", 3, "040"], ["ENGL 3324", "The Development Of The Novel", "", 3, "040"], ["ENGL 3325", "Structures Of Poetry", "", 3, "040"], ["ENGL 3327", "Masterpieces Of British Lit I", "", 3, "040"], ["ENGL 3328", "Masterpieces Of British Lit II", "", 3, "040"], ["ENGL 3350", "Am Lit To 1865", "", 3, "040"], ["ENGL 3351", "Am Lit Since 1865", "", 3, "040"], ["ENGL 3360", "Survey Of African-American Lit", "", 3, "040"], ["ETHN 2300", "Introduction To Ethnic Studies", "", 3, "040"], ["FREN 3318", "History Of French Cinema", "", 3, "040"], ["FREN 3319", "History Of The French Cinema", "", 3, "040"], ["FREN 3321", "Francophone African Cinema", "", 3, "040"], ["FREN 3322", "Francophone African Cinema", "", 3, "040"], ["FREN 3362", "Paris-Berlin: Tales Two Cities", "", 3, "040"], ["FREN 3364", "Writing Holocausts", "", 3, "040"], ["GERM 3350", "20Th C Thru German Culture", "", 3, "040"], ["GERM 3362", "Paris-Berlin: Tales Two Cities", "", 3, "040"], ["GERM 3364", "Writing Holocausts", "", 3, "040"], ["GERM 3369", "World War I In Literature", "", 3, "040"], ["HISP 2373", "Spanish Culture And Civ", "", 3, "040"], ["HISP 2374", "Spanish American Culture & Civ", "", 3, "040"], ["HISP 2375", "Us Hispanic Culture & Civ", "", 3, "040"], ["HIST 2311", "Western Civilization I", "Civilización Occidental I", 3, "040"], ["HIST 2312", "Western Civilization II", "Civilización Occidental II", 3, "040"], ["HIST 2313", "Global Civilization To 1500", "", 3, "040"], ["HIST 2314", "Global Civilization Since 1500", "", 3, "040"], ["HIST 2321", "World Civilizations I", "Civilización Mundial I", 3, "040"], ["HIST 2322", "World Civilizations II", "Civilización Mundial II", 3, "040"], ["HIST 2349", "Latina/O Jewish History", "", 3, "040"], ["HIST 2357", "Modern South Asian History", "", 3, "040"], ["HIST 2365", "African Civ Since 1750", "", 3, "040"], ["HIST 2366", "African Civilizations To 1750", "", 3, "040"], ["HIST 2368", "Intro To African Studies", "", 3, "040"], ["HIST 2371", "Latin America 1492-1820", "", 3, "040"], ["HIST 2372", "Latin American Hist Since 1820", "", 3, "040"], ["HIST 2374", "Popular Culture In Latin Amer", "", 3, "040"], ["HON 2301", "The Human Situation: Antiquity", "", 3, "040"], ["IART 1300", "The Arts In Society", "", 3, "040"], ["ILAS 2350", "Knowledge And Methods", "", 3, "040"], ["ITAL 3306", "Italian Cinema", "", 3, "040"], ["ITAL 3308", "Italian American Cinema", "", 3, "040"], ["ITAL 3336", "Survey Italian Lit In Transl", "", 3, "040"], ["JWST 2372", "The Bible & Modern Pop Culture", "", 3, "040"], ["JWST 2380", "Jewish Civilization", "", 3, "040"], ["JWST 3371", "Women In The Bible", "", 3, "040"], ["MAS 3340", "Mexican Amer Urban Communities", "", 3, "040"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "040"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "040"], ["POLS 3340", "Ancient/Medieval Pol Thought", "", 3, "040"], ["POLS 3342", "Liberalism And Its Critics", "", 3, "040"], ["RELS 1301", "Intro To Religious Studies", "", 3, "040"], ["RELS 2310", "Intro Hebrew Bib/Old Testament", "", 3, "040"], ["RELS 2311", "Intro To The New Testament", "", 3, "040"], ["RELS 2330", "Judaism", "", 3, "040"], ["RELS 2336", "Jewish Civilization", "", 3, "040"], ["RELS 2372", "Bible And Modern Pop Culture", "", 3, "040"], ["RELS 3371", "Women In The Bible", "", 3, "040"], ["SPAN 3331", "Mexican American Literature", "", 3, "040"], ["SPAN 3373", "Spanish Culture & Civilization", "", 3, "040"], ["SPAN 3374", "Span American Culture & Civ", "", 3, "040"], ["SPAN 3375", "Us Hispanic Culture & Civiliza", "", 3, "040"], ["WCL 2351", "World Cultures Thru Lit & Arts", "", 3, "040"], ["WCL 2352", "World Cinema", "", 3, "040"], ["WCL 2370", "Cultures Of India", "", 3, "040"], ["WCL 2380", "Jewish Civilization", "", 3, "040"], ["WCL 3351", "Intro Latino Cultural Studies", "", 3, "040"], ["WCL 3377", "Modern Middle East", "", 3, "040"], ["WGSS 2350", "Intro To Women's Studies", "", 3, "040"], ["WGSS 2360", "Introduction To Lgbt Studies", "", 3, "040"], ["ARCH 2350", "Hist Of The Built Environmt I", "", 3, "050"], ["ARED 2310", "Intro Critical Visual Culture", "", 3, "050"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "050"], ["CLAS 3345", "Myth&Performance In Greek Trag", "", 3, "050"], ["CLAS 3381", "From Homer To Hollywood", "", 3, "050"], ["DANC 2303", "Dance Appreciation", "Apreciación de la Danza", 3, "050"], ["DANC 2323", "Dance In Film", "", 3, "050"], ["DANC 3310", "Dance History I", "", 3, "050"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "050"], ["ENGL 2307", "Intro To Drama", "", 3, "050"], ["ENGL 2318", "Creation And Perform Of Lit", "", 3, "050"], ["GERM 3381", "German Cinema", "", 3, "050"], ["GERM 3384", "Fascism And German Cinema", "", 3, "050"], ["GERM 3385", "East German Cinema", "", 3, "050"], ["HISP 2386", "The Arts Of Spain", "", 3, "050"], ["HISP 2387", "Latinam:History Through Film", "", 3, "050"], ["HIST 2386", "American History Through Film", "", 3, "050"], ["HIST 3301", "Latin American Hist Thru Film", "", 3, "050"], ["HON 3310", "Creativity At Work", "", 3, "050"], ["INDS 2355", "Design History I", "", 3, "050"], ["KORE 3350", "Korean Popular Culture", "", 3, "050"], ["MUED 2342", "Music For Children", "", 3, "050"], ["MUSI 1307", "Music Literature", "Literatura Musical", 3, "050"], ["MUSI 2302", "Listening To Jazz", "", 3, "050"], ["MUSI 2362", "History Of Music I", "", 3, "050"], ["MUSI 3301", "Listening To World Music", "", 3, "050"], ["PHIL 1361", "Philosophy And The Arts", "", 3, "050"], ["POLS 2346", "Politics Of Greek Theater", "", 3, "050"], ["SPAN 3386", "Spanish Culture Through Film", "", 3, "050"], ["THEA 1332", "Fundamentals Of Theatre", "", 3, "050"], ["WCL 3366", "Latin American And Latino Film", "", 3, "050"], ["0 0", "African American Hist Snc 1865", "", 3, "060"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "060"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "060"], ["HIST 2301", "Texas History", "Historia de Texas", 3, "060"], ["HIST 2302", "Texas Since 1865", "", 3, "060"], ["HIST 2327", "Mexican American History I (to the United States-Mexico War Era)", "Historia Mexicoamericana I", 3, "060"], ["HIST 2328", "Mexican American History II (from the United States-Mexico War Era)", "Historia Mexicoamericana II", 3, "060"], ["HIST 2330", "Us Women's History Since 1865", "", 3, "060"], ["HIST 2348", "U.S. Latino/A Histories", "", 3, "060"], ["HIST 2381", "African American History I", "Historia Afroamericana I", 3, "060"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "070"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "070"], ["POLS 1107", "Federal And Texas Constitution", "", 1, "070"], ["POLS 2336", "Us/Tx Const, Politics & Instns", "", 3, "070"], ["AAMS 2300", "Intro Asian American Studies", "", 3, "080"], ["ANTH 2302", "Introduction to Archeology", "Introducción a la Arqueología", 3, "080"], ["ANTH 2346", "General Anthropology", "Antropología General", 3, "080"], ["ANTH 2351", "Cultural Anthropology", "Antropología Cultural", 3, "080"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "080"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "080"], ["ENTR 3310", "Entrepreneurship", "", 3, "080"], ["ENTR 3311", "Technology Entrepreneurship", "", 3, "080"], ["GHL 2365", "Tourism", "", 3, "080"], ["HISP 2355", "Bilingualism, Mind, Society", "", 3, "080"], ["KIN 1304", "Public Hlt Issues In Phys/Obes", "", 3, "080"], ["LST 3354", "Law And Society", "", 3, "080"], ["POLS 3311", "Intro Compar Politics", "", 3, "080"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "080"], ["PSYC 2307", "Psychology Of Adolescence", "", 3, "080"], ["PSYC 2308", "Child Development", "", 3, "080"], ["PSYC 2314", "Lifespan Growth & Development", "", 3, "080"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "080"], ["ANTH 2304", "Intro To Language And Culture", "", 3, "090"], ["ANTH 3348", "Anthropology Of Religion", "", 3, "090"], ["ANTH 3361", "Human Origins", "", 3, "090"], ["ANTH 3381", "Hindu Religion And Identity", "", 3, "090"], ["ARAB 3314", "Women And Gender In Arabic Lit", "", 3, "090"], ["ARTH 3312", "Pre-Columbian Art", "", 3, "090"], ["BCHS 4311", "Biochemistry Lab II", "", 3, "090"], ["BIOL 3311", "Adv Mthds/Writing In Gen Lab", "", 3, "090"], ["BUSI 2305", "Business Statistics", "", 3, "090"], ["BUSI 4350", "Business Law And Ethics", "", 3, "090"], ["CHIN 3344", "Global Chinese Literature", "", 3, "090"], ["CHIN 3354", "Chinese Culture And Language", "", 3, "090"], ["CLAS 4305", "Fifth-Century Athens", "", 3, "090"], ["CLAS 4381", "Latin Classics In Translation", "", 3, "090"], ["COSC 1336", "Computer Science & Program", "", 3, "090"], ["DANC 2303", "Dance Appreciation", "Apreciación de la Danza", 3, "090"], ["DANC 3310", "Dance History I", "", 3, "090"], ["ECON 3344", "History Of Economic Doctrine", "", 3, "090"], ["ECON 3350", "American Economic Growth", "", 3, "090"], ["ELET 2300", "Introductn To C++ Programming", "", 3, "090"], ["ENGI 2304", "Technical Communications", "", 3, "090"], ["ENGL 2320", "Intro To Digital Humanities", "", 3, "090"], ["ENGL 2321", "Writing, Tech And Soc Media", "", 3, "090"], ["ENGL 2330", "Writing Discipline English", "", 3, "090"], ["ENGL 2350", "Writing The Global City", "", 3, "090"], ["GHL 3358", "Hospitality Industry Law", "", 3, "090"], ["HDCS 1300", "Human Ecosystems & Tech Change", "", 3, "090"], ["HDFS 1300", "Dev Of Contemporary Families", "", 3, "090"], ["HIST 2303", "The Historian's Craft", "", 3, "090"], ["HIST 2332", "Intro Law & Soc Engl 1200-1800", "", 3, "090"], ["HIST 2360", "Intro To Hist Of Sci Med Tech", "", 3, "090"], ["HIST 3314", "Lib Vs. Conserv: Fdr To Presen", "", 3, "090"], ["HIST 3341", "The History Of Jewish Food", "", 3, "090"], ["HIST 3344", "Drug History In Latin America", "", 3, "090"], ["HIST 3351", "Work&Family-Modern Eur", "", 3, "090"], ["HIST 3369", "Colonial Mexico", "", 3, "090"], ["HON 2341", "Classics Of Modernity", "", 3, "090"], ["HON 3300", "Intro To Healthcare Systems", "", 3, "090"], ["HON 3310", "Creativity At Work", "", 3, "090"], ["IART 2300", "The Arts In Houston", "", 3, "090"], ["IDNS 4392", "History Of 20Th Cent. Science", "", 3, "090"], ["ITAL 3307", "Italian Renaissance", "", 3, "090"], ["ITAL 3309", "Women Writers & Filmmakers", "", 3, "090"], ["ITAL 3333", "Women Italian Renaissance", "", 3, "090"], ["ITAL 4308", "Dante And His World", "", 3, "090"], ["JWST 3371", "Women In The Bible", "", 3, "090"], ["MAS 3342", "Mexican Immigration To The Us", "", 3, "090"], ["MAS 3345", "Latino Leadership/Activism", "", 3, "090"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "090"], ["MATH 1325", "Calculus for Business & Social Sciences", "Cálculo para Negocios y Ciencias Sociales", 3, "090"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "090"], ["MATH 1350", "Mathematics for Teachers I (Fundamentals of Mathematics I)", "", 3, "090"], ["MATH 1351", "Mathematics for Teachers II  (Fundamentals of Mathematics II)", "", 3, "090"], ["MATH 2312", "Precalculus", "", 3, "090"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "090"], ["MATH 2414", "Calculus II", "Cálculo II", 4, "090"], ["MATH 2450", "Accelerated Calculus I", "", 4, "090"], ["MATH 2451", "Accelerated Calculus II", "", 4, "090"], ["MATH 4388", "History Of Mathematics", "", 3, "090"], ["MUSI 3303", "Pop Music Of Americas Sn 1840", "", 3, "090"], ["NURS 4312", "Ldership And Mgmt In Prof Nur", "", 3, "090"], ["PHIL 1334", "Minds And Machines", "", 3, "090"], ["PHIL 2303", "Introduction to Formal Logic", "", 3, "090"], ["PHYS 3313", "Advanced Laboratory I", "", 3, "090"], ["POLS 3310", "Intro To Political Theory", "", 3, "090"], ["POLS 3312", "Arguments, Data, Politics", "", 3, "090"], ["POLS 3316", "Stats For Political Scientists", "", 3, "090"], ["POLS 3348", "Left, Right, And Center", "", 3, "090"], ["POLS 3349", "American Political Thought", "", 3, "090"], ["PSYC 2317", "Statistical Methods in Psychology", "", 3, "090"], ["PSYC 2320", "Abnormal Psychology", "", 3, "090"], ["PSYC 3310", "Indstrl-Orgnztnl Psy", "", 3, "090"], ["PSYC 4344", "Cultural Psychology", "", 3, "090"], ["RELS 2340", "Lived Hindu Religion", "", 3, "090"], ["RELS 2350", "Introduction To Islam", "", 3, "090"], ["RELS 2360", "Buddhist Traditions: An Intro", "", 3, "090"], ["RELS 3370", "The Bible And Modern Science", "", 3, "090"], ["RELS 3371", "Women In The Bible", "", 3, "090"], ["RELS 3381", "Hindu Religion And Identity", "", 3, "090"], ["SOC 3315", "Sexuality And Society", "", 3, "090"], ["SOC 3351", "Soc Class&Mobilty In Am", "", 3, "090"], ["SOC 3360", "Sociology Of Food", "", 3, "090"], ["SPAN 3384", "Intro To Hispanic Literature", "", 3, "090"], ["THEA 2344", "American Drama", "", 3, "090"], ["TLIM 3363", "Technical Communications", "", 3, "090"], ["TMTH 3360", "Applied Technical Statistics", "", 3, "090"], ["USS 1301", "College Success", "", 3, "090"], ["WCL 3348", "Enlightenment Stories", "", 3, "090"], ["WCL 4351", "Frames Of Modernity I", "", 3, "090"], ["WCL 4352", "Frames Of Modernity II", "", 3, "090"], ["WCL 4356", "World Film And Film Theory", "", 3, "090"], ["WCL 4365", "World Fiction And Reportage", "", 3, "090"], ["WCL 4367", "Voices From Exile And Diaspora", "", 3, "090"]];
const UHCL_RAW = [["ENGL 1301", "Composition I", "Composición I", 3, "010"], ["ENGL 1302", "Composition II", "Composición II", 3, "010"], ["ENGL 2311", "Technical & Business Writing", "Redacción Técnica y de Negocios", 3, "010"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "020"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1325", "Calculus for Business & Social Sciences", "Cálculo para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "020"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "020"], ["MATH 1350", "Mathematics for Teachers I (Fundamentals of Mathematics I)", "", 3, "020"], ["MATH 2412", "Pre-Calculus Math", "Precálculo", 4, "020"], ["MATH 2413", "Calculus I", "Cálculo I", 4, "020"], ["ASTR 1303", "Stars and Galaxies (lecture)", "Estrellas y Galaxias", 3, "030"], ["ASTR 1304", "Solar System (lecture)", "El Sistema Solar", 3, "030"], ["BIOL 1306", "Biology for Science Majors I (lecture)", "Biología para Ciencias I", 3, "030"], ["BIOL 1307", "Biology for Science Majors II (lecture)", "Biología para Ciencias II", 3, "030"], ["BIOL 1308", "Biology for Non-Science Majors I (lecture)", "Biología General I", 3, "030"], ["BIOL 1309", "Biology for Non-Science Majors II (lecture)", "Biología General II", 3, "030"], ["BIOL 1322", "Nutrition & Diet Therapy", "", 3, "030"], ["BIOL 2301", "Anatomy & Physiology I (lecture)", "Anatomía y Fisiología I", 3, "030"], ["BIOL 2302", "Anatomy & Physiology II (lecture)", "Anatomía y Fisiología II", 3, "030"], ["CHEM 1305", "Introductory Chemistry I (lecture)", "Química Introductoria I", 3, "030"], ["CHEM 1311", "General Chemistry I (lecture)", "Química General I", 3, "030"], ["CHEM 1312", "General Chemistry II (lecture)", "Química General II", 3, "030"], ["ENVR 1301", "Environmental Science I", "", 3, "030"], ["ENVR 1302", "Environmental Science II", "", 3, "030"], ["GEOL 1303", "Physical Geology (lecture)", "Geología Física", 3, "030"], ["GEOL 1304", "Historical Geology (lecture)", "Geología Histórica", 3, "030"], ["PHYS 1301", "College Physics I (lecture)", "Física I", 3, "030"], ["PHYS 1302", "College Physics II (lecture)", "Física II", 3, "030"], ["PHYS 2325", "University Physics I (lecture)", "Física Universitaria I", 3, "030"], ["PHYS 2326", "University Physics II (lecture)", "Física Universitaria II", 3, "030"], ["PHYS 2425", "University Physics I (lecture + lab)", "", 4, "030"], ["PHYS 2426", "University Physics II (lecture + lab)", "", 4, "030"], ["0 0", "Gender Matters: Intro To Wgst", "", 3, "040"], ["ANTH 2346", "General Anthropology", "Antropología General", 3, "040"], ["COMM 1307", "Introduction to Mass Communication", "", 3, "040"], ["ENGL 2321", "Writing, Tech And Soc Media", "", 3, "040"], ["ENGL 2326", "American Literature (single-semester course)", "", 3, "040"], ["ENGL 2341", "Forms of Literature", "Formas de Literatura", 3, "040"], ["HIST 2321", "World Civilizations I", "Civilización Mundial I", 3, "040"], ["HIST 2322", "World Civilizations II", "Civilización Mundial II", 3, "040"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "040"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "040"], ["SPAN 2311", "Intermediate Spanish I (3rd semester Spanish)", "", 3, "040"], ["0 0", "Arts And The Child", "", 3, "050"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "050"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "050"], ["ARTS 2372", "Integrating Visual Art", "", 3, "050"], ["DANC 2303", "Dance Appreciation", "Apreciación de la Danza", 3, "050"], ["DRAM 2366", "Film Appreciation", "Apreciación del Cine", 3, "050"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "060"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "060"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "070"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "070"], ["CRIJ 1301", "Introduction to Criminal Justice", "Introducción a la Justicia Penal", 3, "080"], ["ECON 2301", "Principles Of Macroeconomics", "Principios de Macroeconomía", 3, "080"], ["ECON 2302", "Principles Of Microeconomics", "Principios de Microeconomía", 3, "080"], ["GEOG 1303", "World Regional Geography", "Geografía Regional Mundial", 3, "080"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "080"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "080"], ["SOCI 1306", "Social Problems", "", 3, "080"], ["SOCW 2361", "Intro To Soc Work", "", 3, "080"], ["TECA 1354", "Child Growth & Development", "Crecimiento y Desarrollo Infantil", 3, "080"], ["ASTR 1103", "Stars and Galaxies Laboratory (lab)", "Estrellas y Galaxias (laboratorio)", 1, "090"], ["ASTR 1104", "Solar System Laboratory (lab)", "El Sistema Solar (laboratorio)", 1, "090"], ["BIOL 1106", "Biology for Science Majors Laboratory I (lab)", "Biología para Ciencias I (laboratorio)", 1, "090"], ["BIOL 1107", "Biology for Science Majors Laboratory II (lab)", "Biología para Ciencias II (laboratorio)", 1, "090"], ["BIOL 1108", "Biology for Non-Science Majors Laboratory I (lab)", "Biología General I (laboratorio)", 1, "090"], ["BIOL 1109", "Biology for Non-Science Majors Laboratory II (lab)", "Biología General II (laboratorio)", 1, "090"], ["BIOL 2101", "Anatomy & Physiology I (lab)", "Anatomía y Fisiología I (laboratorio)", 1, "090"], ["BIOL 2102", "Anatomy & Physiology II (lab)", "Anatomía y Fisiología II (laboratorio)", 1, "090"], ["CHEM 1105", "Introductory Chemistry Laboratory I (lab)", "Química Introductoria I (laboratorio)", 1, "090"], ["CHEM 1111", "General Chemistry I (lab)", "Química General I (laboratorio)", 1, "090"], ["CHEM 1112", "General Chemistry II (lab)", "Química General II (laboratorio)", 1, "090"], ["EDUC 1301", "Exploring Teaching As A Profes", "", 3, "090"], ["ENVR 1101", "Lab For  Environ Science I", "", 1, "090"], ["ENVR 1102", "Lab For Environ Science II", "", 1, "090"], ["GEOL 1103", "Physical Geology  (lab)", "Geología Física (laboratorio)", 1, "090"], ["GEOL 1104", "Historical Geology (lab)", "Geología Histórica (laboratorio)", 1, "090"], ["PHYS 1101", "College Physics Laboratory I (lab)", "Física I (laboratorio)", 1, "090"], ["PHYS 1102", "College Physics Laboratory II (lab)", "Física II (laboratorio)", 1, "090"], ["PHYS 2125", "University Physics Laboratory I (lab)", "Física Universitaria I (laboratorio)", 1, "090"], ["PHYS 2126", "University Physics Laboratory II (lab)", "Física Universitaria II (laboratorio)", 1, "090"], ["PSYC 1100", "Learning Frameworks", "", 1, "090"], ["PSYC 1300", "Learning Framework (3 SCH version)", "", 3, "090"], ["SPCH 1315", "Public Speaking", "Oratoria", 3, "090"]];
const UHD_RAW = [["ENGL 1301", "Composition I", "Composición I", 3, "010"], ["ENGL 1302", "Composition II", "Composición II", 3, "010"], ["MATH 1314", "College Algebra", "Álgebra Universitaria", 3, "020"], ["MATH 1324", "Mathematics for Business & Social Sciences", "Matemáticas para Negocios y Ciencias Sociales", 3, "020"], ["MATH 1332", "Contemporary Mathematics (Quantitative Reasoning)", "Matemáticas Contemporáneas", 3, "020"], ["MATH 1342", "Elementary Statistical Methods (3 SCH version, freshman level)", "Métodos Estadísticos Elementales", 3, "020"], ["BIOL 1306", "Biology for Science Majors I (lecture)", "Biología para Ciencias I", 3, "030"], ["BIOL 1307", "Biology for Science Majors II (lecture)", "Biología para Ciencias II", 3, "030"], ["BIOL 1322", "Nutrition & Diet Therapy", "", 3, "030"], ["BIOL 1408", "Biology for Non-Science Majors I (lecture + lab)", "", 3, "030"], ["BIOL 1409", "Biology for Non-Science Majors II (lecture + lab)", "", 3, "030"], ["BIOL 2301", "Anatomy & Physiology I (lecture)", "Anatomía y Fisiología I", 3, "030"], ["BIOL 2302", "Anatomy & Physiology II (lecture)", "Anatomía y Fisiología II", 3, "030"], ["BIOL 2320", "Microbiology", "", 3, "030"], ["CHEM 1305", "Introductory Chemistry I (lecture)", "Química Introductoria I", 3, "030"], ["CHEM 1311", "General Chemistry I (lecture)", "Química General I", 3, "030"], ["CHEM 1312", "General Chemistry II (lecture)", "Química General II", 3, "030"], ["GEOL 1303", "Physical Geology (lecture)", "Geología Física", 3, "030"], ["GEOL 1304", "Historical Geology (lecture)", "Geología Histórica", 3, "030"], ["GEOL 1345", "Oceanography (lecture)", "", 3, "030"], ["GEOL 1401", "Earth Sciences for Non-Science Majors  I (lecture + lab)", "", 3, "030"], ["GEOL 1402", "Earth Sciences for Non-Science Majors II (lecture + lab)", "", 3, "030"], ["GEOL 1447", "Meteorology (lecture + lab)", "", 3, "030"], ["MBIO 1310", "Intro To Microbiology", "", 3, "030"], ["NS 1300", "Emergence Of Modern Science", "", 3, "030"], ["PHYS 1301", "College Physics I (lecture)", "Física I", 3, "030"], ["PHYS 1302", "College Physics II (lecture)", "Física II", 3, "030"], ["PHYS 1403", "Stars and Galaxies (lecture + lab)", "", 3, "030"], ["PHYS 1404", "Solar System (lecture + lab)", "", 3, "030"], ["PHYS 2425", "University Physics I (lecture + lab)", "", 4, "030"], ["PHYS 2426", "University Physics II (lecture + lab)", "", 4, "030"], ["ENG 2305", "Literature And Culture", "", 3, "040"], ["ENGL 2322", "British Literature I", "Literatura Británica I", 3, "040"], ["ENGL 2323", "British Literature II", "Literatura Británica II", 3, "040"], ["ENGL 2327", "American Literature I", "Literatura Americana I", 3, "040"], ["ENGL 2328", "American Literature II", "Literatura Americana II", 3, "040"], ["ENGL 2332", "World Literature I", "Literatura Mundial I", 3, "040"], ["ENGL 2333", "World Literature II", "Literatura Mundial II", 3, "040"], ["ENGL 2341", "Forms of Literature", "Formas de Literatura", 3, "040"], ["HUMA 1301", "Introduction to Humanities I", "Introducción a las Humanidades I", 3, "040"], ["HUMA 1302", "Introduction to Humanities II", "", 3, "040"], ["LATS 1301", "Introduction To Latino Studie", "", 3, "040"], ["PHIL 1301", "Introduction To Philosophy", "Introducción a la Filosofía", 3, "040"], ["PHIL 2306", "Introduction To Ethics", "Introducción a la Ética", 3, "040"], ["PHIL 2310", "The Meaning Of Life", "", 3, "040"], ["SPAN 2311", "Intermediate Spanish I (3rd semester Spanish)", "", 3, "040"], ["SPAN 2312", "Intermediate Spanish II (4th semester Spanish)", "", 3, "040"], ["ART 1308", "Introduction To World Art", "", 3, "050"], ["ARTS 1301", "Art Appreciation", "Apreciación del Arte", 3, "050"], ["ARTS 1303", "Art History I (Prehistoric to the 14th century)", "Historia del Arte I", 3, "050"], ["ARTS 1304", "Art History II (14th century to the present)", "Historia del Arte II", 3, "050"], ["DANC 1301", "Dance In America", "", 3, "050"], ["DRA 1303", "Introduction To Acting", "", 3, "050"], ["DRAM 1310", "Theater Appreciation", "Apreciación del Teatro", 3, "050"], ["MUSI 1308", "Music Literature I (scheduled for deletion, funding ends August 31, 2019)", "", 3, "050"], ["MUSI 1309", "Music Literature II (scheduled for deletion, funding ends August 31, 2019)", "", 3, "050"], ["HIST 1301", "United States History I", "Historia de EE.UU. I", 3, "060"], ["HIST 1302", "United States History II", "Historia de EE.UU. II", 3, "060"], ["HIST 2301", "Texas History", "Historia de Texas", 3, "060"], ["HIST 2327", "Mexican American History I (to the United States-Mexico War Era)", "Historia Mexicoamericana I", 3, "060"], ["HIST 2328", "Mexican American History II (from the United States-Mexico War Era)", "Historia Mexicoamericana II", 3, "060"], ["HUMA 2319", "American Minority Studies", "", 3, "060"], ["GOVT 2305", "Federal Government (Federal constitution & topics)", "Gobierno Federal", 3, "070"], ["GOVT 2306", "Texas Government (Texas constitution & topics)", "Gobierno de Texas", 3, "070"], ["ANTH 2351", "Cultural Anthropology", "Antropología Cultural", 3, "080"], ["CRIJ 1301", "Introduction to Criminal Justice", "Introducción a la Justicia Penal", 3, "080"], ["CRS 1301", "Intro To Critical Race Studies", "", 3, "080"], ["ECO 1305", "Contemp Economic Issues", "", 3, "080"], ["HEA 2305", "Wellness Across The Lifespan", "", 3, "080"], ["LANG 1303", "Language And Society", "", 3, "080"], ["PSYC 2301", "General Psychology", "Psicología General", 3, "080"], ["SOCI 1301", "Introduction To Sociology", "Introducción a la Sociología", 3, "080"], ["SOCW 2361", "Intro To Soc Work", "", 3, "080"], ["SOCW 2363", "Intro To Social Welfare Policy", "", 3, "080"], ["COMM 1307", "Introduction to Mass Communication", "", 3, "090"], ["COMM 1309", "Comm & Publ Decision Mkg", "", 3, "090"], ["COMM 2307", "Intercultural Communication", "", 3, "090"], ["COMM 2311", "Media Writing", "", 3, "090"], ["EDUC 1300", "Learning Framework", "", 3, "090"], ["ENG 1306", "Workplace Presentations", "", 3, "090"], ["SPCH 1311", "Introduction to Speech Communication", "Introducción a la Comunicación Oral", 3, "090"], ["SPCH 1315", "Public Speaking", "Oratoria", 3, "090"], ["SPCH 1318", "Interpersonal Communication", "Comunicación Interpersonal", 3, "090"], ["UHD 1302", "First-Year Seminar-Mathematics", "", 3, "090"], ["UHD 1303", "First-Year Seminar-Science", "", 3, "090"], ["UHD 1304", "First-Year Seminar-Culture", "", 3, "090"], ["UHD 1305", "First-Year Seminar-Arts", "", 3, "090"], ["UHD 1306", "First-Year Seminar-History", "", 3, "090"], ["UHD 1307", "First-Year Seminar-Pol Science", "", 3, "090"], ["UHD 1308", "First-Year Seminar-Soc Science", "", 3, "090"], ["UHD 2301", "University Seminar-Commun", "", 3, "090"], ["UHD 2302", "University Seminar-Mathematics", "", 3, "090"], ["UHD 2303", "University Seminar-Sciences", "", 3, "090"], ["UHD 2304", "University Seminar-Culture", "", 3, "090"], ["UHD 2305", "University Seminar-Arts", "", 3, "090"], ["UHD 2306", "University Seminar-History", "", 3, "090"], ["UHD 2307", "University Seminar-Pol Science", "", 3, "090"], ["UHD 2308", "University Seminar-Soc Science", "", 3, "090"]];
const REGIONS = [{
  id: "houston",
  en: "Houston area",
  es: "Área de Houston"
}, {
  id: "gulf",
  en: "Gulf Coast",
  es: "Costa del Golfo"
}, {
  id: "coastalbend",
  en: "Coastal Bend",
  es: "Coastal Bend"
}, {
  id: "border",
  en: "Border region",
  es: "Región fronteriza"
}];
const COLLEGES = {
  sjc: {
    id: "sjc",
    region: "houston",
    en: "San Jacinto College",
    es: "San Jacinto College",
    type: "community",
    kind: {
      en: "Community college",
      es: "Colegio comunitario"
    },
    catalog: "2026-2027",
    verified: {
      en: "Read August 2026",
      es: "Consultado en agosto de 2026"
    },
    source: {
      en: "San Jacinto College approved core curriculum, THECB core curricula export, fiscal year 2026.",
      es: "Core curriculum aprobado de San Jacinto College, export de core curricula de THECB, a\u00f1o fiscal 2026."
    },
    footnotes: true,
    courses: expand(SJC_RAW)
  },
  hcc: {
    id: "hcc",
    region: "houston",
    en: "Houston City College",
    es: "Houston City College",
    type: "community",
    kind: {
      en: "Community college",
      es: "Colegio comunitario"
    },
    catalog: "2026-2027",
    verified: {
      en: "Read August 2026",
      es: "Consultado en agosto de 2026"
    },
    source: {
      en: "Houston City College approved core curriculum, THECB core curricula export, fiscal year 2026.",
      es: "Core curriculum aprobado de Houston City College, export de core curricula de THECB, a\u00f1o fiscal 2026."
    },
    footnotes: false,
    courses: expand(HCC_RAW)
  },
  lsc: {
    id: "lsc",
    region: "houston",
    en: "Lone Star College",
    es: "Lone Star College",
    type: "community",
    kind: {
      en: "Community college",
      es: "Colegio comunitario"
    },
    catalog: "2026-2027",
    verified: {
      en: "Read August 2026",
      es: "Consultado en agosto de 2026"
    },
    source: {
      en: "Lone Star College approved core curriculum, THECB core curricula export, fiscal year 2026.",
      es: "Core curriculum aprobado de Lone Star College, export de core curricula de THECB, a\u00f1o fiscal 2026."
    },
    footnotes: false,
    courses: expand(LSC_RAW)
  },
  alvin: {
    id: "alvin",
    region: "gulf",
    en: "Alvin Community College",
    es: "Alvin Community College",
    type: "community",
    kind: {
      en: "Community college",
      es: "Colegio comunitario"
    },
    catalog: "2026-2027",
    verified: {
      en: "Read August 2026",
      es: "Consultado en agosto de 2026"
    },
    source: {
      en: "Alvin Community College approved core curriculum, THECB core curricula export, fiscal year 2026.",
      es: "Core curriculum aprobado de Alvin Community College, export de core curricula de THECB, a\u00f1o fiscal 2026."
    },
    footnotes: false,
    courses: expand(ALVIN_RAW)
  },
  com: {
    id: "com",
    region: "gulf",
    en: "College of the Mainland",
    es: "College of the Mainland",
    type: "community",
    kind: {
      en: "Community college",
      es: "Colegio comunitario"
    },
    catalog: "2026-2027",
    verified: {
      en: "Read August 2026",
      es: "Consultado en agosto de 2026"
    },
    source: {
      en: "College of the Mainland approved core curriculum, THECB core curricula export, fiscal year 2026.",
      es: "Core curriculum aprobado de College of the Mainland, export de core curricula de THECB, a\u00f1o fiscal 2026."
    },
    footnotes: false,
    courses: expand(COM_RAW)
  },
  lee: {
    id: "lee",
    region: "houston",
    en: "Lee College",
    es: "Lee College",
    type: "community",
    kind: {
      en: "Community college",
      es: "Colegio comunitario"
    },
    catalog: "2026-2027",
    verified: {
      en: "Read August 2026",
      es: "Consultado en agosto de 2026"
    },
    source: {
      en: "Lee College approved core curriculum, THECB core curricula export, fiscal year 2026.",
      es: "Core curriculum aprobado de Lee College, export de core curricula de THECB, a\u00f1o fiscal 2026."
    },
    footnotes: false,
    courses: expand(LEE_RAW)
  },
  delmar: {
    id: "delmar",
    region: "coastalbend",
    en: "Del Mar College",
    es: "Del Mar College",
    type: "community",
    kind: {
      en: "Community college",
      es: "Colegio comunitario"
    },
    catalog: "2026-2027",
    verified: {
      en: "Read August 2026",
      es: "Consultado en agosto de 2026"
    },
    source: {
      en: "Del Mar College approved core curriculum, THECB core curricula export, fiscal year 2026.",
      es: "Core curriculum aprobado de Del Mar College, export de core curricula de THECB, a\u00f1o fiscal 2026."
    },
    footnotes: false,
    courses: expand(DELMAR_RAW)
  },
  swtc: {
    id: "swtc",
    region: "border",
    en: "Southwest Texas College",
    es: "Southwest Texas College",
    type: "community",
    kind: {
      en: "Community college",
      es: "Colegio comunitario"
    },
    catalog: "2026-2027",
    verified: {
      en: "Read August 2026",
      es: "Consultado en agosto de 2026"
    },
    source: {
      en: "Southwest Texas College approved core curriculum, THECB core curricula export, fiscal year 2026.",
      es: "Core curriculum aprobado de Southwest Texas College, export de core curricula de THECB, a\u00f1o fiscal 2026."
    },
    footnotes: false,
    courses: expand(SWTC_RAW)
  },
  sulross: {
    id: "sulross",
    region: "border",
    en: "Sul Ross State University",
    es: "Sul Ross State University",
    type: "university",
    kind: {
      en: "Public university",
      es: "Universidad pública"
    },
    catalog: "2026-2027",
    verified: {
      en: "Read August 2026",
      es: "Consultado en agosto de 2026"
    },
    source: {
      en: "Sul Ross State University approved core curriculum, THECB core curricula export, fiscal year 2026.",
      es: "Core curriculum aprobado de Sul Ross State University, export de core curricula de THECB, a\u00f1o fiscal 2026."
    },
    footnotes: false,
    courses: expand(SULROSS_RAW)
  },
  tamiu: {
    id: "tamiu",
    region: "border",
    en: "Texas A&M International University",
    es: "Texas A&M International University",
    type: "university",
    kind: {
      en: "Public university",
      es: "Universidad pública"
    },
    catalog: "2026-2027",
    verified: {
      en: "Read August 2026",
      es: "Consultado en agosto de 2026"
    },
    source: {
      en: "Texas A&M International University approved core curriculum, THECB core curricula export, fiscal year 2026.",
      es: "Core curriculum aprobado de Texas A&M International University, export de core curricula de THECB, a\u00f1o fiscal 2026."
    },
    footnotes: false,
    courses: expand(TAMIU_RAW)
  },
  uh: {
    id: "uh",
    region: "houston",
    en: "University of Houston",
    es: "University of Houston",
    type: "university",
    kind: {
      en: "Public university",
      es: "Universidad pública"
    },
    catalog: "2026-2027",
    verified: {
      en: "Read August 2026",
      es: "Consultado en agosto de 2026"
    },
    source: {
      en: "University of Houston approved core curriculum, THECB core curricula export, fiscal year 2026.",
      es: "Core curriculum aprobado de University of Houston, export de core curricula de THECB, a\u00f1o fiscal 2026."
    },
    footnotes: false,
    courses: expand(UH_RAW)
  },
  uhcl: {
    id: "uhcl",
    region: "houston",
    en: "University of Houston-Clear Lake",
    es: "University of Houston-Clear Lake",
    type: "university",
    kind: {
      en: "Public university",
      es: "Universidad pública"
    },
    catalog: "2026-2027",
    verified: {
      en: "Read August 2026",
      es: "Consultado en agosto de 2026"
    },
    source: {
      en: "University of Houston-Clear Lake approved core curriculum, THECB core curricula export, fiscal year 2026.",
      es: "Core curriculum aprobado de University of Houston-Clear Lake, export de core curricula de THECB, a\u00f1o fiscal 2026."
    },
    footnotes: false,
    courses: expand(UHCL_RAW)
  },
  uhd: {
    id: "uhd",
    region: "houston",
    en: "University of Houston-Downtown",
    es: "University of Houston-Downtown",
    type: "university",
    kind: {
      en: "Public university",
      es: "Universidad pública"
    },
    catalog: "2026-2027",
    verified: {
      en: "Read August 2026",
      es: "Consultado en agosto de 2026"
    },
    source: {
      en: "University of Houston-Downtown approved core curriculum, THECB core curricula export, fiscal year 2026.",
      es: "Core curriculum aprobado de University of Houston-Downtown, export de core curricula de THECB, a\u00f1o fiscal 2026."
    },
    footnotes: false,
    courses: expand(UHD_RAW)
  }
};

/* Transfer comparison. Every university in the registry carries its own
   approved core, so the comparison is computed from that rather than
   stored per course. Only universities in the same region as the college
   being tracked are shown, and a university never compares against
   itself. */
const UNI_CORES = Object.values(COLLEGES).filter(c => c.type === "university").map(c => ({
  id: c.id,
  en: c.en,
  es: c.es,
  region: c.region,
  codes: new Set(c.courses.map(x => x.c))
}));
const peersFor = college => UNI_CORES.filter(u => u.region === college.region && u.id !== college.id);

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
const STORE = "ap_core_tracker_v5";

/* Storage is wrapped because some preview environments block it.
   The tool works either way; only the remembering is lost. */
const load = () => {
  try {
    const r = window.localStorage.getItem(STORE);
    return r ? JSON.parse(r) : null;
  } catch (e) {
    return null;
  }
};
const save = data => {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(data));
  } catch (e) {
    /* nothing to do; the session still works */
  }
};
const T = {
  en: {
    kicker: "Anchored Pathways",
    title: "Core Tracker",
    intro: "In Texas, the core is a set of 42 hours of basic college classes that every public college teaches. When a student finishes the whole core at one public college, every other public college and university in Texas has to accept all 42 hours toward its own core. This page shows how many hours are done and which areas are still open.",
    pickHead: "Choose the college awarding the credit",
    pickWhy: "Pick the college that gives the college credit, not the high school. Each college publishes its own list of approved core courses, so the list changes with the college.",
    pickSearch: "Search colleges",
    change: "Change college",
    marked: "hours marked",
    of: "of 42",
    filled: "Requirement filled",
    remaining: "still needed",
    beyond: "beyond this requirement",
    flows: "Extra hours here can count toward the Component Area Option, up to 6 hours.",
    caoInflow: "Hours beyond what another area requires move here automatically, up to 6 hours. Courses shown in another area can end up counting here.",
    dualNote: "The catalog lists this course in this area and in the Component Area Option. It counts in one or the other, never both.",
    searchCourses: "Search by course code or name",
    noMatch: "No courses match that search in this area.",
    expand: "Show courses",
    collapse: "Hide courses",
    transferToggle: "Show which public universities in this region list each course in their own core",
    transferNote: "These tags show whether a course appears in that university's own approved core curriculum. They do not tell you whether a course will transfer or count toward a major. Ask each university.",
    transferNone: "Not in the approved core at any of these universities.",
    dcToggle: "Some of these were taken as dual credit in high school",
    dcTitle: "What dual credit changes",
    dcBody: "Dual credit hours count toward the core only once they appear on a college transcript from the college that awarded them. A high school transcript does not carry them.",
    dcAsk: "Ask the high school counselor which college awarded each course and how to request that college's transcript. Ask before the last transcript request date in the student's final semester.",
    unabsorbed: "not counted toward any area. Each area has a limit, and the Component Area Option fills at 6 hours.",
    pastCore: "beyond the 42-hour core.",
    allied: "The catalog notes this course is designed for allied health majors and not for academic transfer as a science major.",
    notSci: "The catalog notes this course does not meet the requirements for science majors.",
    mathSci: "The catalog notes this course does not meet the requirements for students pursuing mathematics or science.",
    labNote: "The catalog notes students must be co-enrolled in the co-requisite science lab. Labs are listed under the Component Area Option.",
    mathOverflow: "This is a 4 hour course. The catalog notes the overflow hour may be accounted for in the Component Area Option or in the Transfer Path.",
    nextHead: "What to do next",
    nextEmpty: "Mark every core course the student has already passed. This page remembers your marks on this device, so you can stop and come back.",
    nextPartialA: "Areas still open:",
    nextPartialB: "Ask the college advisor which of these areas the student's planned courses will fill, and whether any area is already full. Ask before registration opens for the next term.",
    nextDone: "All 42 hours are marked. Print this page and take it to the college advisor.",
    nextDoneAsk: "Ask: can you confirm core complete is posted on my transcript before I transfer? Ask before the transfer application deadline.",
    print: "Print this page",
    reset: "Clear all marks",
    resetConfirm: "Clear every mark for this college? This cannot be undone.",
    foot: "Core curriculum data from the Texas Higher Education Coordinating Board approved core curricula export and each college's published catalog. Requirements change. Confirm with the college.",
    disclaim: "This tool reports published requirements. It does not recommend courses or predict what any college will accept.",
    printedFor: "Core Tracker result",
    tagline: ""
  },
  es: {
    kicker: "Anchored Pathways",
    title: "Rastreador del Core",
    intro: "En Texas, el core es un conjunto de 42 horas de clases universitarias básicas que enseña cada colegio público. Cuando un estudiante termina el core completo en un colegio público, todos los demás colegios y universidades públicas de Texas tienen que aceptar las 42 horas para su propio core. Esta página muestra cuántas horas están hechas y qué áreas siguen abiertas.",
    pickHead: "Elija el colegio que otorga el crédito",
    pickWhy: "Elija el colegio que da el crédito universitario, no la preparatoria. Cada colegio publica su propia lista de cursos aprobados del core, así que la lista cambia según el colegio.",
    pickSearch: "Buscar colegios",
    change: "Cambiar de colegio",
    marked: "horas marcadas",
    of: "de 42",
    filled: "Requisito cumplido",
    remaining: "que faltan",
    beyond: "más allá de este requisito",
    flows: "Las horas extra aquí pueden contar para la Opción de Área Componente, hasta 6 horas.",
    caoInflow: "Las horas que sobran de lo que requiere otra área pasan aquí automáticamente, hasta 6 horas. Los cursos que aparecen en otra área pueden terminar contando aquí.",
    dualNote: "El catálogo incluye este curso en esta área y en la Opción de Área Componente. Cuenta en una o en la otra, nunca en las dos.",
    searchCourses: "Buscar por código o nombre del curso",
    noMatch: "Ningún curso de esta área coincide con esa búsqueda.",
    expand: "Ver cursos",
    collapse: "Ocultar cursos",
    transferToggle: "Mostrar qué universidades públicas de esta región incluyen cada curso en su propio core",
    transferNote: "Estas etiquetas muestran si un curso aparece en el core aprobado de esa universidad. No indican si el curso se transferirá ni si contará para una carrera. Pregunte en cada universidad.",
    transferNone: "No está en el core aprobado de ninguna de estas universidades.",
    dcToggle: "Algunos de estos se tomaron como dual credit en la preparatoria",
    dcTitle: "Lo que cambia con dual credit",
    dcBody: "Las horas de dual credit cuentan para el core solo cuando aparecen en una transcripción universitaria del colegio que otorgó el crédito. La transcripción de la preparatoria no las lleva.",
    dcAsk: "Pregunte al consejero de la preparatoria qué colegio otorgó cada curso y cómo pedir la transcripción de ese colegio. Pregunte antes de la última fecha para pedir transcripciones en el semestre final del estudiante.",
    unabsorbed: "que no cuentan para ninguna área. Cada área tiene un límite, y la Opción de Área Componente se llena a las 6 horas.",
    pastCore: "más allá del core de 42 horas.",
    allied: "El catálogo indica que este curso está diseñado para carreras de salud aliada y no para transferencia académica como especialidad en ciencias.",
    notSci: "El catálogo indica que este curso no cumple los requisitos para especialidades en ciencias.",
    mathSci: "El catálogo indica que este curso no cumple los requisitos para estudiantes que siguen matemáticas o ciencias.",
    labNote: "El catálogo indica que el estudiante debe inscribirse al mismo tiempo en el laboratorio correspondiente. Los laboratorios están en la Opción de Área Componente.",
    mathOverflow: "Este curso es de 4 horas. El catálogo indica que la hora sobrante puede contarse en la Opción de Área Componente o en el Transfer Path.",
    nextHead: "Qué hacer ahora",
    nextEmpty: "Marque cada curso del core que el estudiante ya haya aprobado. Esta página guarda sus marcas en este dispositivo, así que puede parar y volver después.",
    nextPartialA: "Áreas que siguen abiertas:",
    nextPartialB: "Pregunte al asesor del colegio qué áreas van a cumplir los cursos que el estudiante piensa tomar, y si alguna área ya está llena. Pregunte antes de que abra la inscripción del próximo semestre.",
    nextDone: "Las 42 horas están marcadas. Imprima esta página y llévela al asesor del colegio.",
    nextDoneAsk: "Pregunte: ¿me puede confirmar que el core completo aparece en mi transcripción antes de transferirme? Pregunte antes de la fecha límite de solicitud de transferencia.",
    print: "Imprimir esta página",
    reset: "Borrar todas las marcas",
    resetConfirm: "¿Borrar todas las marcas de este colegio? Esto no se puede deshacer.",
    foot: "Datos del core curriculum del export de core curricula aprobados de la Texas Higher Education Coordinating Board y del catálogo publicado de cada colegio. Los requisitos cambian. Confirme con el colegio.",
    disclaim: "Esta herramienta reporta requisitos publicados. No recomienda cursos ni predice lo que aceptará una universidad.",
    printedFor: "Resultado del Rastreador del Core",
    tagline: "Porque nadie debería recorrer el camino solo."
  }
};
const hours = (n, lang) => lang === "en" ? `${n} ${n === 1 ? "hour" : "hours"}` : `${n} ${n === 1 ? "hora" : "horas"}`;
function CoreTracker() {
  const saved = load() || {};
  const [lang, setLang] = useState(saved.lang === "es" ? "es" : "en");
  const [collegeId, setCollegeId] = useState(saved.collegeId && COLLEGES[saved.collegeId] ? saved.collegeId : null);
  const [picked, setPicked] = useState(saved.picked || {});
  const [dualCredit, setDualCredit] = useState(!!saved.dualCredit);
  const [showTransfer, setShowTransfer] = useState(false);
  const [open, setOpen] = useState({});
  const [q, setQ] = useState("");
  const [collegeQ, setCollegeQ] = useState("");
  const t = T[lang];
  useEffect(() => {
    save({
      lang,
      collegeId,
      picked,
      dualCredit
    });
  }, [lang, collegeId, picked, dualCredit]);
  const college = collegeId ? COLLEGES[collegeId] : null;
  const peers = college ? peersFor(college) : [];
  const grouped = useMemo(() => {
    if (!college) return [];
    const needle = q.trim().toLowerCase();
    return AREAS.map(a => {
      const all = college.courses.filter(c => c.a === a.id);
      const list = needle ? all.filter(c => c.c.toLowerCase().includes(needle) || c.t.toLowerCase().includes(needle) || c.ts.toLowerCase().includes(needle)) : all;
      return {
        area: a,
        list,
        total: all.length
      };
    });
  }, [college, q]);
  const calc = useMemo(() => {
    const byArea = {};
    AREAS.forEach(a => byArea[a.id] = {
      raw: 0,
      counted: 0,
      over: 0
    });
    if (college) {
      college.courses.forEach(c => {
        if (picked[c.c]) byArea[c.a].raw += c.h;
      });
    }
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
    const openAreas = AREAS.filter(a => byArea[a.id].counted < a.req);
    return {
      byArea,
      total,
      past: cao.over,
      openAreas
    };
  }, [picked, college]);
  const toggle = code => setPicked(p => ({
    ...p,
    [code]: !p[code]
  }));
  const toggleArea = id => setOpen(o => ({
    ...o,
    [id]: !o[id]
  }));
  const chooseCollege = id => {
    setCollegeId(id);
    setPicked({});
    setOpen({});
    setQ("");
  };
  const header = /*#__PURE__*/React.createElement("header", {
    style: S.head
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: S.kicker
  }, t.kicker), /*#__PURE__*/React.createElement("h1", {
    style: S.h1
  }, t.title)), /*#__PURE__*/React.createElement("button", {
    style: S.lang,
    onClick: () => setLang(lang === "en" ? "es" : "en")
  }, lang === "en" ? "Español" : "English"));

  /* ---------- College picker ---------- */
  if (!college) {
    const needle = collegeQ.trim().toLowerCase();
    const all = Object.values(COLLEGES).filter(c => !needle || c.en.toLowerCase().includes(needle) || c.es.toLowerCase().includes(needle));
    return /*#__PURE__*/React.createElement("div", {
      style: S.page
    }, /*#__PURE__*/React.createElement("style", null, CSS), header, /*#__PURE__*/React.createElement("p", {
      style: S.intro
    }, t.intro), /*#__PURE__*/React.createElement("section", {
      style: S.pickWrap
    }, /*#__PURE__*/React.createElement("h2", {
      style: S.h2
    }, t.pickHead), /*#__PURE__*/React.createElement("p", {
      style: S.pickWhy
    }, t.pickWhy), Object.keys(COLLEGES).length > 8 && /*#__PURE__*/React.createElement("input", {
      style: S.search,
      value: collegeQ,
      onChange: e => setCollegeQ(e.target.value),
      placeholder: t.pickSearch,
      "aria-label": t.pickSearch
    }), REGIONS.map(r => {
      const inRegion = all.filter(c => c.region === r.id);
      if (!inRegion.length) return null;
      return /*#__PURE__*/React.createElement("div", {
        key: r.id,
        style: {
          marginTop: 22
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: S.regionLabel
      }, lang === "en" ? r.en : r.es), /*#__PURE__*/React.createElement("div", {
        style: S.pickList
      }, inRegion.map(c => /*#__PURE__*/React.createElement("button", {
        key: c.id,
        style: S.pickBtn,
        onClick: () => chooseCollege(c.id)
      }, /*#__PURE__*/React.createElement("span", {
        style: S.pickName
      }, lang === "en" ? c.en : c.es), /*#__PURE__*/React.createElement("span", {
        style: S.pickMeta
      }, lang === "en" ? c.kind.en : c.kind.es, " \xB7 ", c.catalog)))));
    })), /*#__PURE__*/React.createElement("footer", {
      style: S.foot
    }, /*#__PURE__*/React.createElement("div", null, t.disclaim), t.tagline && /*#__PURE__*/React.createElement("div", {
      style: S.tag
    }, t.tagline)));
  }

  /* ---------- Tracker ---------- */
  return /*#__PURE__*/React.createElement("div", {
    style: S.page
  }, /*#__PURE__*/React.createElement("style", null, CSS), header, /*#__PURE__*/React.createElement("div", {
    style: S.collegeBar,
    className: "ap-noprint"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: S.collegeName
  }, lang === "en" ? college.en : college.es), /*#__PURE__*/React.createElement("div", {
    style: S.collegeMeta
  }, lang === "en" ? college.source.en : college.source.es, " ", lang === "en" ? college.verified.en : college.verified.es)), /*#__PURE__*/React.createElement("button", {
    style: S.change,
    onClick: () => setCollegeId(null)
  }, t.change)), /*#__PURE__*/React.createElement("div", {
    style: S.printOnly,
    className: "ap-printonly"
  }, t.printedFor, " \xB7 ", lang === "en" ? college.en : college.es, " \xB7 ", calc.total, "/42"), /*#__PURE__*/React.createElement("section", {
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
      title: `${lang === "en" ? a.en : a.es} — ${d.counted}/${a.req}`
    }, /*#__PURE__*/React.createElement("div", {
      style: S.barTrack
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...S.barFill,
        height: `${d.counted / a.req * 100}%`,
        background: done ? "#1A5F6E" : "#4E8F9C"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: S.barLabel
    }, a.id));
  })), calc.past > 0 && /*#__PURE__*/React.createElement("div", {
    style: S.pastNote
  }, hours(calc.past, lang), " ", calc.total >= 42 ? t.pastCore : t.unabsorbed)), /*#__PURE__*/React.createElement("section", {
    style: S.next
  }, /*#__PURE__*/React.createElement("h2", {
    style: S.nextHead
  }, t.nextHead), calc.total === 0 && /*#__PURE__*/React.createElement("p", {
    style: S.nextBody
  }, t.nextEmpty), calc.total > 0 && calc.total < 42 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: S.nextBody
  }, /*#__PURE__*/React.createElement("strong", null, t.nextPartialA), " ", calc.openAreas.map(a => lang === "en" ? a.en : a.es).join(" · ")), /*#__PURE__*/React.createElement("p", {
    style: S.nextBody
  }, t.nextPartialB)), calc.total >= 42 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: S.nextBody
  }, t.nextDone), /*#__PURE__*/React.createElement("p", {
    style: S.nextBody
  }, t.nextDoneAsk)), dualCredit && /*#__PURE__*/React.createElement("div", {
    style: S.dcBox
  }, /*#__PURE__*/React.createElement("strong", null, t.dcTitle), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, t.dcBody), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, t.dcAsk)), /*#__PURE__*/React.createElement("button", {
    style: S.primary,
    onClick: () => window.print(),
    className: "ap-noprint"
  }, t.print)), /*#__PURE__*/React.createElement("section", {
    style: S.controls,
    className: "ap-noprint"
  }, /*#__PURE__*/React.createElement("input", {
    style: S.search,
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: t.searchCourses,
    "aria-label": t.searchCourses
  }), /*#__PURE__*/React.createElement("label", {
    style: S.switch
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: dualCredit,
    onChange: () => setDualCredit(!dualCredit),
    style: S.cbSm
  }), /*#__PURE__*/React.createElement("span", null, t.dcToggle)), peers.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    style: S.switch
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: showTransfer,
    onChange: () => setShowTransfer(!showTransfer),
    style: S.cbSm
  }), /*#__PURE__*/React.createElement("span", null, t.transferToggle)), showTransfer && /*#__PURE__*/React.createElement("div", {
    style: S.transferNote
  }, t.transferNote))), grouped.map(({
    area,
    list,
    total
  }) => {
    const d = calc.byArea[area.id];
    const done = d.counted >= area.req;
    const searching = q.trim().length > 0;
    const isOpen = !!open[area.id] || searching && list.length > 0;
    const markedHere = list.filter(c => picked[c.c]).length;
    return /*#__PURE__*/React.createElement("section", {
      key: area.id,
      style: S.area
    }, /*#__PURE__*/React.createElement("button", {
      style: S.areaHead,
      onClick: () => toggleArea(area.id),
      "aria-expanded": isOpen
    }, /*#__PURE__*/React.createElement("span", {
      style: S.areaLeft
    }, /*#__PURE__*/React.createElement("span", {
      style: S.areaId
    }, area.id), /*#__PURE__*/React.createElement("span", {
      style: S.areaName
    }, lang === "en" ? area.en : area.es), /*#__PURE__*/React.createElement("span", {
      style: S.areaSub
    }, done ? t.filled : `${hours(area.req - d.counted, lang)} ${t.remaining}`, markedHere > 0 && ` · ${markedHere} ✓`)), /*#__PURE__*/React.createElement("span", {
      style: S.areaRight
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...S.areaHours,
        color: done ? "#1A5F6E" : "#5B6B70"
      }
    }, d.counted, "/", area.req), /*#__PURE__*/React.createElement("span", {
      style: S.chev,
      "aria-hidden": "true"
    }, isOpen ? "−" : "+"))), area.id === "090" && /*#__PURE__*/React.createElement("div", {
      style: S.flows
    }, t.caoInflow), d.over > 0 && area.id !== "090" && /*#__PURE__*/React.createElement("div", {
      style: S.flows
    }, t.flows), isOpen && /*#__PURE__*/React.createElement("div", {
      style: S.list
    }, list.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: S.emptyNote
    }, t.noMatch), list.map(c => /*#__PURE__*/React.createElement(React.Fragment, {
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
    }, c.h)), showTransfer && peers.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: S.uhTags
    }, peers.some(u => u.codes.has(c.c)) ? peers.map(u => /*#__PURE__*/React.createElement("span", {
      key: u.id,
      style: {
        ...S.tagPill,
        ...(u.codes.has(c.c) ? S.tagOn : S.tagOff)
      }
    }, lang === "en" ? u.en : u.es)) : /*#__PURE__*/React.createElement("span", {
      style: S.tagNone
    }, t.transferNone)), c.dual && /*#__PURE__*/React.createElement("div", {
      style: S.inlineNote
    }, t.dualNote), college.footnotes && FOOTNOTE[c.c] && /*#__PURE__*/React.createElement("div", {
      style: S.inlineNote
    }, t[FOOTNOTE[c.c]]), college.footnotes && NEEDS_LAB.has(c.c) && /*#__PURE__*/React.createElement("div", {
      style: S.inlineNote
    }, t.labNote), college.footnotes && FOUR_HOUR_MATH.has(c.c) && /*#__PURE__*/React.createElement("div", {
      style: S.inlineNote
    }, t.mathOverflow)))), !isOpen && !searching && /*#__PURE__*/React.createElement("button", {
      style: S.expandBtn,
      onClick: () => toggleArea(area.id)
    }, t.expand, " (", total, ")"), !isOpen && searching && /*#__PURE__*/React.createElement("div", {
      style: S.emptyNote
    }, t.noMatch));
  }), /*#__PURE__*/React.createElement("button", {
    style: S.reset,
    className: "ap-noprint",
    onClick: () => {
      if (window.confirm(t.resetConfirm)) setPicked({});
    }
  }, t.reset), /*#__PURE__*/React.createElement("footer", {
    style: S.foot
  }, /*#__PURE__*/React.createElement("div", null, t.disclaim), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, t.foot), t.tagline && /*#__PURE__*/React.createElement("div", {
    style: S.tag
  }, t.tagline)));
}
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600&display=swap');
* { box-sizing: border-box; }
input[type=checkbox] { accent-color: #1A5F6E; }
label:focus-within { outline: 2px solid #9C551A; outline-offset: 2px; }
button:focus-visible, input:focus-visible { outline: 2px solid #9C551A; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
.ap-printonly { display: none; }
@media print {
  .ap-noprint { display: none !important; }
  .ap-printonly { display: block !important; }
  body { background: #fff; }
}
`;
const INK = "#14505E";
const INK_ON_GOLD = "#0F3D48";
const DEEP = "#1A5F6E";
const MUTED = "#5B6B70";
const LINE = "#E2EBED";
const BURNT = "#9C551A";
const S = {
  page: {
    fontFamily: "'Work Sans', system-ui, sans-serif",
    maxWidth: 720,
    margin: "0 auto",
    padding: "28px 20px 60px",
    background: "#fff",
    color: INK
  },
  head: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12
  },
  kicker: {
    fontSize: 12,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: BURNT,
    fontWeight: 600
  },
  h1: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 34,
    lineHeight: 1.08,
    margin: "6px 0 0",
    fontWeight: 600,
    color: INK
  },
  lang: {
    background: "none",
    border: `1px solid ${DEEP}`,
    color: DEEP,
    borderRadius: 999,
    padding: "12px 18px",
    minHeight: 44,
    fontSize: 14,
    fontFamily: "inherit",
    cursor: "pointer",
    whiteSpace: "nowrap"
  },
  intro: {
    fontSize: 16,
    lineHeight: 1.6,
    marginTop: 20,
    color: "#255760"
  },
  pickWrap: {
    marginTop: 30,
    paddingTop: 26,
    borderTop: `1px solid ${LINE}`
  },
  h2: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 22,
    fontWeight: 600,
    margin: 0
  },
  pickWhy: {
    fontSize: 15,
    lineHeight: 1.6,
    marginTop: 10,
    color: MUTED
  },
  regionLabel: {
    fontSize: 12,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: MUTED,
    fontWeight: 600
  },
  pickList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 10
  },
  pickBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
    width: "100%",
    minHeight: 60,
    background: "#fff",
    border: `1px solid ${DEEP}`,
    borderRadius: 6,
    padding: "14px 16px",
    fontFamily: "inherit",
    cursor: "pointer",
    textAlign: "left"
  },
  pickName: {
    fontSize: 17,
    fontWeight: 600,
    color: DEEP
  },
  pickMeta: {
    fontSize: 13,
    color: MUTED
  },
  collegeBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 14,
    marginTop: 22,
    paddingTop: 18,
    borderTop: `1px solid ${LINE}`
  },
  collegeName: {
    fontSize: 17,
    fontWeight: 600,
    color: DEEP
  },
  collegeMeta: {
    fontSize: 13,
    lineHeight: 1.5,
    color: MUTED,
    marginTop: 4
  },
  change: {
    background: "none",
    border: `1px solid ${LINE}`,
    color: MUTED,
    borderRadius: 999,
    padding: "11px 16px",
    minHeight: 44,
    fontSize: 13,
    fontFamily: "inherit",
    cursor: "pointer",
    whiteSpace: "nowrap"
  },
  printOnly: {
    fontSize: 14,
    fontWeight: 600,
    marginTop: 10
  },
  blockWrap: {
    marginTop: 26
  },
  blockNums: {
    display: "flex",
    alignItems: "baseline",
    gap: 10
  },
  bigNum: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 54,
    fontWeight: 600,
    lineHeight: 1,
    color: DEEP,
    fontVariantNumeric: "tabular-nums"
  },
  smallNum: {
    fontSize: 15,
    color: MUTED
  },
  bars: {
    display: "flex",
    gap: 5,
    alignItems: "flex-end",
    marginTop: 14,
    height: 92
  },
  barCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 6
  },
  barTrack: {
    background: LINE,
    borderRadius: 3,
    height: 72,
    display: "flex",
    alignItems: "flex-end"
  },
  barFill: {
    width: "100%",
    borderRadius: 3,
    transition: "height .18s ease"
  },
  barLabel: {
    fontSize: 12,
    color: MUTED,
    textAlign: "center",
    letterSpacing: ".04em"
  },
  pastNote: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 1.5,
    color: BURNT,
    background: "#FDF4E7",
    padding: "11px 13px",
    borderRadius: 5
  },
  next: {
    marginTop: 24,
    padding: "18px 18px 20px",
    background: "#F2F7F8",
    border: `1px solid ${LINE}`,
    borderRadius: 6
  },
  nextHead: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 20,
    fontWeight: 600,
    margin: 0
  },
  nextBody: {
    fontSize: 15,
    lineHeight: 1.6,
    marginTop: 10,
    color: "#255760"
  },
  dcBox: {
    marginTop: 14,
    fontSize: 14.5,
    lineHeight: 1.55,
    background: "#FFF9EE",
    border: `1px solid #F5A623`,
    padding: "13px 15px",
    borderRadius: 5,
    color: INK
  },
  primary: {
    marginTop: 16,
    background: "#F5A623",
    border: "none",
    color: INK_ON_GOLD,
    borderRadius: 6,
    padding: "14px 22px",
    minHeight: 48,
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
    width: "100%"
  },
  controls: {
    marginTop: 26,
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  search: {
    width: "100%",
    minHeight: 48,
    padding: "12px 14px",
    fontSize: 16,
    fontFamily: "inherit",
    color: INK,
    border: `1px solid #CFDDE0`,
    borderRadius: 6,
    background: "#fff"
  },
  switch: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    minHeight: 44,
    fontSize: 14.5,
    lineHeight: 1.45,
    color: MUTED,
    cursor: "pointer"
  },
  cbSm: {
    width: 22,
    height: 22,
    flexShrink: 0,
    cursor: "pointer"
  },
  transferNote: {
    fontSize: 13.5,
    lineHeight: 1.55,
    color: MUTED
  },
  area: {
    padding: "6px 0 18px",
    borderTop: `1px solid ${LINE}`,
    marginTop: 14
  },
  areaHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    width: "100%",
    minHeight: 56,
    padding: "12px 0",
    background: "none",
    border: "none",
    fontFamily: "inherit",
    cursor: "pointer",
    textAlign: "left",
    color: INK
  },
  areaLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 3
  },
  areaRight: {
    display: "flex",
    alignItems: "center",
    gap: 12
  },
  areaId: {
    fontSize: 12,
    color: MUTED,
    letterSpacing: ".08em"
  },
  areaName: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 19,
    fontWeight: 600
  },
  areaSub: {
    fontSize: 13.5,
    color: MUTED
  },
  areaHours: {
    fontSize: 16,
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums"
  },
  chev: {
    fontSize: 22,
    color: MUTED,
    lineHeight: 1,
    width: 22,
    textAlign: "center"
  },
  flows: {
    fontSize: 13.5,
    color: MUTED,
    marginTop: 4,
    lineHeight: 1.5
  },
  expandBtn: {
    background: "none",
    border: `1px solid ${LINE}`,
    color: MUTED,
    borderRadius: 999,
    padding: "10px 16px",
    minHeight: 44,
    fontSize: 13.5,
    fontFamily: "inherit",
    cursor: "pointer",
    marginTop: 4
  },
  list: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    gap: 2
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minHeight: 48,
    padding: "10px 12px",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 15
  },
  rowOn: {
    background: "#EDF5F6"
  },
  cb: {
    width: 22,
    height: 22,
    flexShrink: 0,
    cursor: "pointer"
  },
  code: {
    fontWeight: 600,
    minWidth: 90,
    fontSize: 14,
    letterSpacing: ".01em"
  },
  name: {
    flex: 1,
    color: "#31606A"
  },
  hrs: {
    color: MUTED,
    fontSize: 14,
    fontVariantNumeric: "tabular-nums"
  },
  emptyNote: {
    color: MUTED,
    fontSize: 14,
    padding: "10px 12px"
  },
  uhTags: {
    display: "flex",
    gap: 6,
    padding: "0 12px 10px 46px",
    flexWrap: "wrap"
  },
  tagPill: {
    fontSize: 12,
    padding: "4px 9px",
    borderRadius: 4,
    letterSpacing: ".02em",
    whiteSpace: "nowrap"
  },
  tagOn: {
    background: "#E1EEF0",
    color: DEEP,
    fontWeight: 600
  },
  tagOff: {
    background: "#EDF1F2",
    color: MUTED,
    textDecoration: "line-through"
  },
  tagNone: {
    fontSize: 13,
    color: MUTED
  },
  inlineNote: {
    fontSize: 13.5,
    lineHeight: 1.5,
    color: MUTED,
    padding: "2px 12px 10px 46px"
  },
  reset: {
    marginTop: 30,
    background: "none",
    border: `1px solid #CFDDE0`,
    color: MUTED,
    borderRadius: 999,
    padding: "12px 20px",
    minHeight: 44,
    fontSize: 14,
    fontFamily: "inherit",
    cursor: "pointer"
  },
  foot: {
    marginTop: 34,
    paddingTop: 20,
    borderTop: `1px solid ${LINE}`,
    fontSize: 13,
    lineHeight: 1.6,
    color: MUTED
  },
  tag: {
    marginTop: 16,
    fontFamily: "'Fraunces', Georgia, serif",
    fontStyle: "italic",
    color: DEEP,
    fontSize: 15
  }
};
