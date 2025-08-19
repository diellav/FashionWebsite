import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import '../../template/ProfilePage.css';

const Overview = () => {
  const [chartData, setChartData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [sales, setSales] = useState({ total_sales: 0, total_products_sold: 0 });

  useEffect(() => {
    const loadGoogleCharts = () =>
      new Promise((resolve) => {
        if (window.google && window.google.charts) {
          resolve();
        } else {
          const script = document.createElement("script");
          script.src = "https://www.gstatic.com/charts/loader.js";
          script.onload = () => {
            window.google.charts.load("current", { packages: ["corechart"] });
            window.google.charts.setOnLoadCallback(resolve);
          };
          document.body.appendChild(script);
        }
      });

    const fetchDataAndDraw = async () => {
      const [productsRes, cartItemsRes, categoriesRes, salesRes] = await Promise.all([
        axiosInstance.get("/products-dashboard"),
        axiosInstance.get("/order_items"),
        axiosInstance.get("/categories-navbar"),
        axiosInstance.get('/order_items_sales'),
      ]);

      const products = productsRes.data;
      const cartItems = cartItemsRes.data;
      const categories = categoriesRes.data;
      const sales = salesRes.data;
     setSales(sales);
      const productStats = cartItems.reduce((acc, item) => {
        if (!acc[item.productID]) acc[item.productID] = 0;
        acc[item.productID] += item.quantity;
        return acc;
      }, {});

      const dataArray = [["Product", "Quantity"]];
      for (const id in productStats) {
        const product = products.find((p) => p.id === parseInt(id));
        dataArray.push([product ? product.name : "Unknown", productStats[id]]);
      }
      setChartData(dataArray);

      const categoryStats = products.reduce((acc, product) => {
        if (!acc[product.categoryID]) acc[product.categoryID] = 0;
        acc[product.categoryID] += 1;
        return acc;
      }, {});

      const categoryArray = [["Category", "Count"]];
      for (const categoryID in categoryStats) {
         const category=categories.find((c)=>c.id===parseInt(categoryID));
        categoryArray.push([category ? category.name : "Unknown",  categoryStats[categoryID]]);
      }
      setCategoryData(categoryArray);

      if (window.google && window.google.visualization) {
        const colData = window.google.visualization.arrayToDataTable(dataArray);
        const colOptions = {
          title: "Most Popular Products",
          hAxis: { title: "Product" },
          vAxis: { minValue: 0 },
        };
        new window.google.visualization.ColumnChart(
          document.getElementById("chart_div")
        ).draw(colData, colOptions);

        const pieData = window.google.visualization.arrayToDataTable(categoryArray);
        const pieOptions = { title: "Products by Category",  is3D: true, };
        new window.google.visualization.PieChart(
          document.getElementById("chart_div2")
        ).draw(pieData, pieOptions);
      }
    };

    loadGoogleCharts().then(fetchDataAndDraw);
  }, []);

  return (
    <div>
      <h4 style={{ textIndent:"100px" }}>Overview</h4>
      <br></br>
      <h5 style={{ textIndent:"100px" }}>Revenue: €{sales.total_sales}</h5>
      <h5 style={{ textIndent:"100px"  }}>Total Products Sold: {sales.total_products_sold}</h5>
      <div id="chart_div" style={{ width: "100%", height: "400px", justifySelf:"center" }}></div>
      <div id="chart_div2" style={{ width: "100%", height: "400px", justifySelf:"center" }}></div>
    </div>
  );
};

export default Overview;
