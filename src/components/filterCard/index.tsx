import { IPartnerCategoryEntity } from "@domains/entities/interfaces/iPartnerCategory";
import css from "./_filterCard.module.scss";
interface Props {
  category: IPartnerCategoryEntity;
  clicked?: boolean;
}
const FilterCard = (params: Props) => {
  return (
    <div className={params.clicked ? css.filterCardClicked : css.filterCard}>
      <div className={params.clicked ? css.textClicked : ""}>
        {params.category.nameKey}
      </div>
    </div>
  );
};

export default FilterCard;
