import { IPartnerCategoryEntity } from "@domains/entities/interfaces/iPartnerCategory";

export interface IPartnerCategoryPresenter {
  getPartnersCategories(): Promise<Array<IPartnerCategoryEntity>>;
}
