/* import del from "del"; */
import { deleteAsync } from "del";
export const reset = () => {
	return deleteAsync(app.path.clean);
}
