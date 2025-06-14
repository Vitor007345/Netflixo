import { setupInterativities, configRegister, configLogin} from "../../../modules/login/index.mjs";
import { btnChange } from "../../../modules/login/constantes.mjs";
import { hasParam } from "../../../modules/utils/index.mjs";

setupInterativities();
configRegister();
configLogin();

if(hasParam('register')){
    btnChange.click();
}

