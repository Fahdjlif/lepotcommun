import { IPartnerEntity } from "@domains/entities/interfaces/iPartner";
import React, { useState } from "react";
import css from "./_card.module.scss";
interface Params {
  partner: IPartnerEntity;
}
const URL_PREFIX = "https://recette2.lepotcommuntest.fr";
const Card = (params: Params) => {
  const [style, setStyle] = useState({ display: "none" });
  const isValidHttpUrl = (url: string) => {
    try {
      var link = new URL(url);
    } catch (_) {
      return false;
    }

    return link.protocol === "http:" || link.protocol === "https:";
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
        style={{
          backgroundImage: isValidHttpUrl(params.partner.imageUrl)
            ? params.partner.imageUrl
            : URL_PREFIX + params.partner.imageUrl,
        }}
        src={
          isValidHttpUrl(params.partner.imageUrl)
            ? params.partner.imageUrl
            : URL_PREFIX + params.partner.imageUrl
        }
        alt={
          isValidHttpUrl(params.partner.imageUrl)
            ? params.partner.imageUrl
            : URL_PREFIX + params.partner.imageUrl
        }
      ></img>
      <img
        className={css.logo}
        src={
          isValidHttpUrl(params.partner.logoUrl)
            ? params.partner.logoUrl
            : URL_PREFIX + params.partner.logoUrl
        }
        alt={
          isValidHttpUrl(params.partner.logoUrl)
            ? params.partner.imageUrl
            : URL_PREFIX + params.partner.logoUrl
        }
      ></img>

      <div style={style} className={css.info}>
        <table>
          <tbody>
            <tr>
              <td>
                <img
                  className={css.logoHover}
                  src={
                    isValidHttpUrl(params.partner.logoUrl)
                      ? params.partner.logoUrl
                      : URL_PREFIX + params.partner.logoUrl
                  }
                  alt={
                    isValidHttpUrl(params.partner.logoUrl)
                      ? params.partner.imageUrl
                      : URL_PREFIX + params.partner.logoUrl
                  }
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
