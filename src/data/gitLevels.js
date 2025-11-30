export const gitLevels = {

    1: [
        { text: "Git es un sistema de control de versiones distribuido.", answer: true },
        { text: "El comando 'git init' crea un nuevo repositorio.", answer: true },
        { text: "GitHub y Git son lo mismo.", answer: false },
        { text: "Un commit es una captura de los cambios.", answer: true },
        { text: "git add . agrega todos los archivos al staging area.", answer: true },
    ],

    2: [
        { text: "git clone sirve para copiar un repositorio remoto.", answer: true },
        { text: "git status muestra los archivos modificados.", answer: true },
        { text: "git push envía cambios del repositorio local al remoto.", answer: true },
        { text: "git pull solo descarga cambios pero no los fusiona.", answer: false },
        { text: "Un branch permite trabajar sin afectar la rama principal.", answer: true },
    ],

    3: [
        { text: "git merge combina dos ramas.", answer: true },
        { text: "git checkout -b crea una nueva rama.", answer: true },
        { text: "git stash guarda cambios temporalmente.", answer: true },
        { text: "git reset --hard conserva los cambios del working directory.", answer: false },
        { text: "HEAD apunta al commit actual.", answer: true },
    ],

    4: [
        { text: "git rebase reescribe la historia del repositorio.", answer: true },
        { text: "git cherry-pick toma commits específicos de otra rama.", answer: true },
        { text: "git revert elimina commits sin modificar el historial.", answer: false },
        { text: "git log muestra el historial de commits.", answer: true },
        { text: "git tag se usa para marcar versiones específicas.", answer: true },
    ],
};
