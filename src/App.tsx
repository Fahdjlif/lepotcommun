import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const [filteredPartners, setFilteredPartners] = useState<
    Array<IPartnerEntity>
  >([]);
  const [displayPartners, setDisplayPartners] = useState<Array<IPartnerEntity>>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<
    Array<IPartnerCategoryEntity>
  >([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef<any>();

  const lastPartner = useCallback(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          if ((pageNumber + 1) * 10 > filteredPartners.length) {
            setHasMore(false);
          }
          var newPartners = displayPartners.concat(
            filteredPartners.slice(
              10 * (pageNumber + 1),
              10 * (pageNumber + 1) + 10
            )
          );
          setPageNumber(pageNumber + 1);
          setDisplayPartners(newPartners);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [hasMore, filteredPartners, pageNumber, displayPartners]
  );

  useEffect(() => {
    di.partner.getPartners().then((data) => {
      setPartners(data);
      setFilteredPartners(data);
      setDisplayPartners(data.slice(0, 20));
    });
    di.partnerCategory
      .getPartnersCategories()
      .then((data) => setCategories(data));
  }, []);

  const sortAndFilter = async (category: IPartnerCategoryEntity) => {
    var categories = selectedCategories;
    if (selectedCategories.includes(category)) {
      categories.splice(categories.indexOf(category), 1);
    } else {
      categories.push(category);
    }
    setSelectedCategories(categories);
    if (categories.length === 0 && partners) {
      setFilteredPartners(partners ? partners : []);
      setDisplayPartners(partners.slice(0, 20));
      resetPaging(partners);
      return;
    }
    if (partners) {
      const filtered = partners.filter((it) =>
        it.partnerCategories
          .map((category) => category.partnerCategoryID)
          .some((categoryId) =>
            categories.map((selected) => selected.id).includes(categoryId)
          )
      );
      setFilteredPartners(filtered);
      setDisplayPartners(filtered.slice(0, 20));
      resetPaging(filtered);
    }
  };
  const resetPaging = (filtered: IPartnerEntity[]) => {
    setHasMore(filtered.length > 20);
    setPageNumber(1);
  };
  return (
    <div className="App">
      <PageHeader />
      <div>
        {categories ? (
          categories.map((category) => (
            <div onClick={() => sortAndFilter(category)} key={category.id}>
              <FilterCard
                category={category}
                clicked={selectedCategories?.includes(category)}
              ></FilterCard>
            </div>
          ))
        ) : (
          <img src={"images/loading.svg"} alt={"images/loading.svg"}></img>
        )}
      </div>
      <div>
        {displayPartners ? (
          displayPartners.map((partner, index) => {
            if (displayPartners.length === index + 1) {
              return (
                <div ref={lastPartner} key={partner.id}>
                  <Card partner={partner} key={partner.id}></Card>
                </div>
              );
            } else {
              return (
                <div key={partner.id}>
                  <Card partner={partner}></Card>
                </div>
              );
            }
          })
        ) : (
          <img src={"images/loading.svg"} alt={"images/loading.svg"}></img>
        )}
      </div>
    </div>
  );
}

export default App;
