import css from "./_filterCard.module.scss";
interface Props {
  category: string;
  clicked?: boolean;
}
const FilterCard = (params: Props) => {
  return (
    <div className={params.clicked ? css.filterCardClicked : css.filterCard}>
      <div className={params.clicked ? css.textClicked : ""}>
        {params.category}
      </div>
    </div>
  );
};

export default FilterCard;
