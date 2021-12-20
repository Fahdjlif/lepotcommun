import { IPartnerEntity } from "@domains/entities/interfaces/iPartner";
import React from "react";
import css from "./_card.module.scss";
interface Params {
  partner: IPartnerEntity;
}
const Card = (params: Params) => {
  return (
    <div className={css.card}>
      <div>{params.partner.name}</div>
    </div>
  );
};

export default Card;
