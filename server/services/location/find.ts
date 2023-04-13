import dao from "../../dao";
import { District, Province, Ward } from "../../../modules/database/entities";
import {
  IDistrictResponse,
  ILocationAllDistrict,
  ILocationAllProvince,
  ILocationAllWard,
  IProvinceResponse,
  IWardResponse,
} from "../../../internal/interfaces/location";

const isValidLocation = async (provinceId: string, districtId: string, wardId: string): Promise<boolean> => {
  const promiseP = dao.location.find.countProvinceById(provinceId);
  const promiseD = dao.location.find.countDistrictById(districtId, provinceId);
  const promiseW = dao.location.find.countWardById(wardId, districtId);

  const [countP, countD, countW] = await Promise.all([promiseP, promiseD, promiseW]);

  return countP > 0 && countD > 0 && countW > 0;
};

const convertProvinceModelToResponse = (province: Province): IProvinceResponse => {
  if (!province) {
    return {} as IProvinceResponse;
  }
  return {
    id: province.id,
    name: province.name,
    code: province.code,
    createdAt: province.createdAt,
    updatedAt: province.updatedAt,
  } as IProvinceResponse;
};

const convertDistrictModelToResponse = (dist: District): IDistrictResponse => {
  if (!dist) {
    return {} as IDistrictResponse;
  }
  return {
    id: dist.id,
    name: dist.name,
    code: dist.code,
    provinceId: dist.provinceId,
    createdAt: dist.createdAt,
    updatedAt: dist.updatedAt,
  } as IDistrictResponse;
};

const convertWardModelToResponse = (ward: Ward): IWardResponse => {
  if (!ward) {
    return {} as IWardResponse;
  }
  return {
    id: ward.id,
    name: ward.name,
    code: ward.code,
    districtId: ward.districtId,
    createdAt: ward.createdAt,
    updatedAt: ward.updatedAt,
  } as IWardResponse;
};

const allProvince = async (): Promise<ILocationAllProvince> => {
  const [rs, err] = await dao.location.find.allProvinces();

  if (!rs) {
    return {
      provinces: [],
      total: 0,
    } as ILocationAllProvince;
  }

  return {
    provinces: rs?.map((r) => convertProvinceModelToResponse(r)),
    total: rs?.length | 0,
  } as ILocationAllProvince;
};

const allDistrictByProvinceId = async (id: string): Promise<ILocationAllDistrict> => {
  const [rs, err] = await dao.location.find.allDistrictByProvinceId(id);

  if (!rs) {
    return {
      districts: [],
      total: 0,
    } as ILocationAllDistrict;
  }

  return {
    districts: rs?.map((r) => convertDistrictModelToResponse(r)),
    total: rs?.length,
  } as ILocationAllDistrict;
};

const allWardByDistrictId = async (id: string): Promise<ILocationAllWard> => {
  const [rs, err] = await dao.location.find.allWardByDistrictId(id);

  if (!rs) {
    return {
      wards: [],
      total: 0,
    } as ILocationAllWard;
  }

  return {
    wards: rs?.map((r) => convertWardModelToResponse(r)),
    total: rs?.length,
  } as ILocationAllWard;
};

export default {
  isValidLocation,
  convertProvinceModelToResponse,
  convertDistrictModelToResponse,
  convertWardModelToResponse,
  allProvince,
  allDistrictByProvinceId,
  allWardByDistrictId,
};
