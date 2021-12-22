import { IPartnerEntity } from "@domains/entities/interfaces/iPartner";
import React, { useState } from "react";
import css from "./_card.module.scss";
interface Params {
  partner: IPartnerEntity;
}
const URL_PREFIX = "https://recette2.lepotcommuntest.fr";
const Card = (params: Params) => {
  //Display card info on hover, hide otherwise
  const [style, setStyle] = useState({ display: "none" });

  //check if link is valid url, otherwise append url prefix
  const getValidHttpUrl = (url: string): string => {
    try {
      new URL(url);
    } catch (_) {
      return URL_PREFIX + url;
    }

    return url;
  };
  return (
    <div
      className={css.card}
      onMouseEnter={(e) => {
        setStyle({ display: "block" });
      }}
      onMouseLeave={(e) => {
        setStyle({ display: "none" });
      }}
    >
      <img
        className={css.image}
        src={getValidHttpUrl(params.partner.imageUrl)}
        alt={getValidHttpUrl(params.partner.imageUrl)}
        onError={(e: any) => {
          e.target.onError = null;
          e.target.src = "images/placeholder.png";
        }}
      ></img>
      <img
        className={css.logo}
        src={getValidHttpUrl(params.partner.imageUrl)}
        alt={getValidHttpUrl(params.partner.imageUrl)}
        onError={(e: any) => {
          e.target.onError = null;
          e.target.src = "images/placeholder.png";
        }}
      ></img>

      <div style={style} className={css.info}>
        <table>
          <tbody>
            <tr>
              <td>
                <img
                  className={css.logoHover}
                  src={getValidHttpUrl(params.partner.imageUrl)}
                  alt={getValidHttpUrl(params.partner.imageUrl)}
                  onError={(e: any) => {
                    e.target.onError = null;
                    e.target.src = "images/placeholder.png";
                  }}
                ></img>
              </td>
              <td className={css.infoRow}>
                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      params.partner.desc.length > 250
                        ? params.partner.desc.substring(0, 250) + "..."
                        : params.partner.desc,
                  }}
                />
                <button className={css.btn}>{"Choisir  >"}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Card;
