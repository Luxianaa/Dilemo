import javaLogo from "../assets/logos/java.svg";
import dartLogo from "../assets/logos/dart.svg";
import geminiLogo from "../assets/logos/gemini.svg";
import mysaqlLogo from "../assets/logos/mysql-icon-light.svg";
import postgresqlLogo from "../assets/logos/postgresql.svg";

//------------------level2--------
import linuxLogo  from "../assets/logos/linux.svg";
import deepLogo  from "../assets/logos/deepseek.svg";
import grokLogo  from "../assets/logos/grok-light.svg";
import  mongoLogo from "../assets/logos/mongodb-icon-dark.svg";
import operaLogo  from "../assets/logos/opera.svg";
//------------------level3--------
import jwtLogo from "../assets/logos/jwt.svg";
import kotlinLogo from "../assets/logos/kotlin.svg";
import laravelLogo from "../assets/logos/laravel.svg";
import dotnetLogo from "../assets/logos/dotnet.svg";
import duckLogo from "../assets/logos/duckduckgo.svg";


export const logoQuizLevels = {
  1: [
    { img: javaLogo, text: "Este es el logo de CoffeeCode", answer: false },
    { img: dartLogo, text: "Este es el logo de Dart", answer: true },
    { img: geminiLogo, text: "Este es el logo de Gemini", answer: true },
    { img: mysaqlLogo, text: "Este es el logo de PostgreSQL", answer: false },
    { img: postgresqlLogo, text: "Este es el logo de MariaDB", answer: false },

  ],
  2: [ 
      {img: linuxLogo, text: "Este es el logo de AWS", answer:false},
      {img: deepLogo, text: "Este es el logo de Laravel", answer:false},
      {img: grokLogo, text: "Este es el logo de Grok", answer:true},
      {img: mongoLogo, text: "Este es el logo de MongoDB", answer:true},
      {img: operaLogo, text: "Este es el logo de Opera", answer:true},
  ],

  3:[
      {img: jwtLogo, text:"Esto es una base de datos", answer:false},
  {img: kotlinLogo, text:"Es un lenguaje de programación", answer:true},
  {img: laravelLogo, text:"Esto es LouvreUI", answer:false},
  {img: dotnetLogo, text:"Esto es plataforma de desarrollo de código abierto", answer:true},
  {img: duckLogo, text: "Esto es un Framework", answer:falsex},
  ],
};


