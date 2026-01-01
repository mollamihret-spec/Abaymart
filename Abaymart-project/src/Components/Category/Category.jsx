import React from 'react';
import CategoryCard from './CategoryCard';
import { categoryInfos } from './CategoryFullInfos';
import classes from './Category.module.css'
function Category() {
  return (
    <section className={classes.category_container}>
      {categoryInfos.map((infos, index) => (
        <CategoryCard key={index} data={infos} />
      ))}
    </section>
  );
}

export default Category;
