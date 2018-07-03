export class User{
    constructor(//Si asignamos las variables desde el constructor no debemos de inicializarlas :)
        public _id: string,
        public name: string,
        public surname: string,
        public nick: string,
        public email: string,
        public password: string,
        public role: string,
        public image: string
    ){

    }
}