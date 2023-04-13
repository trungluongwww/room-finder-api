import { User } from "../../../modules/database/entities";
import pmongo from "../../../external_node/ultils/pmongo";
import ptoken from "../../../external_node/ultils/ptoken";
import dao from "../../dao";
import { IUserCreatePayload } from "../../../internal/interfaces/user";
import errorcode from "../../../internal/errorcode";
import strings from "../../../external_node/ultils/strings";
import location from "../location";

const fromClient = async (payload: IUserCreatePayload): Promise<Error | null> => {
  // validate identity info
  if ((await dao.user.find.countByIdentity(payload.username, payload.phone)) > 0) {
    return Error(errorcode.user.USER_ALREADY_EXITS);
  }

  // validate location info

  if (!(await location.find.isValidLocation(payload.provinceId, payload.districtId, payload.wardId))) {
    return Error(errorcode.address.ADDRESS_COMMON_INVALID);
  }

  // create model
  const hashPw = await ptoken.hashPassword(payload.password);

  const user = new User();
  user.id = pmongo.newStringId();
  user.username = payload.username;
  user.password = hashPw;
  user.phone = payload.phone;
  user.name = payload.name;
  user.provinceId = payload.provinceId;
  user.wardId = payload.wardId;
  user.districtId = payload.districtId;
  user.address = payload.address;
  user.searchText = strings.content.convertToLowerUsLang([user.name, user.username].join(" "));

  return await dao.user.create.one(user);
};

export default {
  fromClient,
};