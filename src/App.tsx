import React, { useEffect, useState } from "react";
import "./styles/global.scss";
import di from "./di";
import PageHeader from "@components/pageHeader";
import { IPartnerEntity } from "@domains/entities/interfaces/iPartner";
import Card from "@components/card";
import { IPartnerCategoryEntity } from "@domains/entities/interfaces/iPartnerCategory";
import FilterCard from "@components/filterCard";

function App() {
  const [partners, setPartners] = useState<Array<IPartnerEntity>>();
  const [categories, setCategories] = useState<Array<IPartnerCategoryEntity>>();
  useEffect(() => {
    di.partner.getPartners().then((data) => setPartners(data));
    di.partnerCategory
      .getPartnersCategories()
      .then((data) => setCategories(data));
  }, []);

  return (
    <div className="App">
      <PageHeader />
      <div>
        {categories ? (
          categories.map((category) => (
            <div key={category.id}>
              <FilterCard category={category}></FilterCard>
            </div>
          ))
        ) : (
          <img src={"images/loading.svg"} alt={"images/loading.svg"}></img>
        )}
      </div>
      <div>
        {partners ? (
          partners.map((partner, index) => {
            return (
              <div key={index}>
                <Card partner={partner}></Card>
              </div>
            );
          })
        ) : (
          <img src={"images/loading.svg"} alt={"images/loading.svg"}></img>
        )}
      </div>
    </div>
  );
}

export default App;
