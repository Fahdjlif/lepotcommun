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
  const [pageNumber, setPageNumber] = useState(0);
  const observer = useRef<any>();

  //Detect end of scroll and add more elements
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
    var partnerData: IPartnerEntity[];
    di.partner.getPartners().then((data) => {
      setPartners(data);
      partnerData = data;
      di.partnerCategory.getPartnersCategories().then((data) => {
        setCategories(data);
        initSelection(data, partnerData);
      });
    });
  }, []);

  //Initialize partners,categories and filter once fetched
  function initSelection(
    categoriesData: IPartnerCategoryEntity[],
    partnersData: IPartnerEntity[]
  ) {
    const storedFilter = localStorage.getItem("selectedCategories")
      ? categoriesData.filter((item) =>
          JSON.parse(localStorage.getItem("selectedCategories")!).includes(
            item.id
          )
        )
      : [];
    if (storedFilter.length === 0) {
      resetFilter(partnersData);
    } else {
      setSelectedCategories(storedFilter);
      if (storedFilter.length === 0 && partners) {
        setFilteredPartners(partners ? partners : []);
        setDisplayPartners(partners.slice(0, 10));
        resetPaging(partners);
        return;
      }
      const filtered = partnersData.filter((it) =>
        it.partnerCategories
          .map((category) => category.partnerCategoryID)
          .some((categoryId) =>
            storedFilter.map((selected) => selected.id).includes(categoryId)
          )
      );
      setFilteredPartners(filtered);
      setDisplayPartners(filtered.slice(0, 10));
      resetPaging(filtered);
    }
  }
  //Filter partners by category, reset paging
  const filter = (category: IPartnerCategoryEntity) => {
    var categories = selectedCategories;
    if (selectedCategories.includes(category)) {
      categories.splice(categories.indexOf(category), 1);
    } else {
      categories.push(category);
    }
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify(categories.map((item) => item.id))
    );
    setSelectedCategories(categories);

    if (categories.length === 0 && partners) {
      setFilteredPartners(partners ? partners : []);
      setDisplayPartners(partners.slice(0, 10));
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
      setDisplayPartners(filtered.slice(0, 10));
      resetPaging(filtered);
    }
  };

  const resetPaging = (filtered: IPartnerEntity[]) => {
    setHasMore(filtered.length > 10);
    setPageNumber(0);
  };

  const resetFilter = (partnersData?: IPartnerEntity[]) => {
    localStorage.removeItem("selectedCategories");
    setSelectedCategories([]);
    setFilteredPartners(partnersData ? partnersData : partners ? partners : []);
    setDisplayPartners(
      partnersData
        ? partnersData.slice(0, 10)
        : partners
        ? partners.slice(0, 10)
        : []
    );
    setHasMore(true);
    setPageNumber(0);
  };

  return (
    <div className="App">
      <PageHeader />
      <div className="categoriesContainer">
        <div onClick={() => resetFilter()}>
          <FilterCard
            category={"Tous"}
            clicked={selectedCategories.length === 0}
          ></FilterCard>
        </div>
        {categories ? (
          categories.map((category) => (
            <div onClick={() => filter(category)} key={category.id}>
              <FilterCard
                category={category.nameKey}
                clicked={selectedCategories
                  ?.map((item) => item.id)
                  .includes(category.id)}
              ></FilterCard>
            </div>
          ))
        ) : (
          <img src={"images/loading.svg"} alt={"images/loading.svg"}></img>
        )}
      </div>
      <div className="partnersContainer">
        {partners ? (
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
