import React, { useState, useEffect,useRef } from "react";
import axiosInstance from "../../../axios";
import CreateCategoryForm from "./CategoryForm";
import '../../../template/ProfilePage.css';
const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategorie] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const debounceTimeout = useRef(null);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, catsRes] = await Promise.all([
        axiosInstance.get('/categories',{params: {page,limit,sort,order,search}}),
        axiosInstance.get('/categories-navbar'),
      ]);
     setCategories(Array.isArray(categoriesRes.data.data) ? categoriesRes.data.data : []);
      console.log('Categories response:', categoriesRes.data.data);
      setTotalPages(categoriesRes.data.last_page);
      setCats(catsRes.data);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, sort, order, search]);

  const handleAddClick = () => {
    setEditingCategorie(null);
    setShowForm(true);
  };

  const handleEditClick = (categorie) => {
    setEditingCategorie(categorie);
    setShowForm(true);
  };

  const handleDeleteClick = async (categorieId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axiosInstance.delete(`/categories/${categorieId}`);
        alert("Category deleted successfully");
        fetchData();
      } catch (err) {
        alert("Failed to delete categorie");
      }
    }
  };
  const handleFormSaved = () => {
    setShowForm(false);
    fetchData();
  };
  const handleFormCancel = () => {
    setShowForm(false);
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    setSearching(true);       
    debounceTimeout.current = setTimeout(() => {
      setSearch(value); 
      setPage(1);       
    }, 500); 
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="editProfile">
      {!showForm && (
        <>
          <h2>Categories List</h2>
             <div className="search-sort-controls">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="name">Name</option>
              <option value="description">Description</option>
              <option value="image">Image</option>
              <option value="parentID">Parent Category</option>
            </select>
            <select value={order} onChange={e => setOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>


          <button onClick={handleAddClick} className="addButton">Add Categorie</button>
          <div style={{ position: 'relative' }}>
          {loading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255,255,255,0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
            }}>
                <p>Loading...</p></div>)}
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Image</th>
                <th>Parent Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(categorie => {
                const categorieRole = cats.find(r => r.id === categorie.parentID);
                return (
                  <tr key={categorie.id}>
                    <td>{categorie.name}</td>
                    <td>{categorie.description}</td>
                    <td>{categorie.image}</td>
                    <td>{categorieRole ? categorieRole.name : '-'}</td>
                    <td>
                      <button onClick={() => handleEditClick(categorie)}>Edit</button>
                      <button onClick={() => handleDeleteClick(categorie.id)}>Delete</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
    </div>


           <div className="pagination">
  <button 
    onClick={() => setPage(page - 1)} 
    disabled={page === 1}
  >
    Prev
  </button>

  {[...Array(totalPages)].map((_, index) => {
    const pageNumber = index + 1;
    return (
      <button
        key={pageNumber}
        onClick={() => setPage(pageNumber)}
        className={pageNumber === page ? 'active' : ''}
      >
        {pageNumber}
      </button>
    );
  })}

  <button 
    onClick={() => setPage(page + 1)} 
    disabled={page === totalPages}
  >
    Next
  </button>
</div>

        </>
      )}

      {showForm && (
        <CreateCategoryForm
          category={editingCategory}
          categories={cats}
          onSaved={handleFormSaved}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default CategoryPage;
