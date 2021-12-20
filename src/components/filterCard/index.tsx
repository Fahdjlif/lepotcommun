import { IPartnerCategoryEntity } from "@domains/entities/interfaces/iPartnerCategory";
import React from "react";
import css from "./_filterCard.module.scss";

interface Props {
  category: IPartnerCategoryEntity;
  clicked?: boolean;
}
const FilterCard = (params: Props) => {
  return (
    <div className={css.filterCard}>
      <div>{params.category.nameKey}</div>
    </div>
  );
};

export default FilterCard;
