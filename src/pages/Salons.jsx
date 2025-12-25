import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SearchInput from "../components/SearchInput.jsx";
import Pagination from "../components/Pagination.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { salons as salonData, cities } from "../data/mockData.js";

const ITEMS_PER_PAGE = 20;

const Salons = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Single Modal state for Add/Edit
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingSalonId, setEditingSalonId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    rating: 4.5,
    status: "active",
    services: [""],

  });

  const handleServiceChange = (index, value) => {
    const newServices = [...formData.services];
    newServices[index] = value;
    setFormData({ ...formData, services: newServices });
  };

  const addService = () => {
    setFormData({ ...formData, services: [...formData.services, ""] });
  };

  const removeService = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: newServices });
  };


  const filtered = useMemo(() => {
    return salonData.filter((salon) => {
      const matchesSearch =
        salon.name.toLowerCase().includes(search.toLowerCase()) ||
        salon.address.toLowerCase().includes(search.toLowerCase());
      const matchesCity = cityFilter === "all" || salon.city === cityFilter;
      const matchesStatus =
        statusFilter === "all" || salon.status === statusFilter;
      return matchesSearch && matchesCity && matchesStatus;
    });
  }, [search, cityFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Open Add Modal
  const handleAddSalon = () => {
    setModalMode("add");
    setEditingSalonId(null);
    setFormData({
      name: "",
      city: "",
      address: "",
      rating: 4.5,
      status: "active",
      services: [],
      openingTime: "9:00 AM - 9:00 PM",
      images: []
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const handleEditSalon = (salon) => {
    setModalMode("edit");
    setEditingSalonId(salon.id);
    setFormData({
      name: salon.name || "",
      city: salon.city || "",
      address: salon.address || "",
      rating: salon.rating || 4.5,
      status: salon.status || "active",
      services: salon.services || [],
      openingTime: salon.openingTime || "9:00 AM - 9:00 PM",
      images: []
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    formData.images.forEach(image => {
      if (image.preview) URL.revokeObjectURL(image.preview);
    });
    setShowModal(false);
    setIsSubmitting(false);
    setFormData({
      name: "",
      city: "",
      address: "",
      rating: 4.5,
      status: "active",
      services: [],
      openingTime: "9:00 AM - 9:00 PM",
      images: []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const submitData = {
      ...(modalMode === "edit" && { id: editingSalonId }),
      ...formData,
      images: formData.images.map(img => img.file)
    };

    // console.log(`${modalMode === "add" ? "New" : "Updated"} salon:`, submitData);
    handleCloseModal();
    alert(`${modalMode === "add" ? "Salon added" : "Salon updated"} successfully with ${formData.images.length} images!`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`Image ${file.name} is too large. Max 5MB allowed.`);
        return null;
      }
      return {
        file,
        preview: URL.createObjectURL(file)
      };
    }).filter(Boolean);

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
    e.target.value = '';
  };

  const removeImage = (index) => {
    const image = formData.images[index];
    if (image.preview) URL.revokeObjectURL(image.preview);

    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: newImages };
    });
  };

  return (
    <Layout>
      <div className="pb-4 p-md-4">
        <div className="card shadow-sm border-0 mb-3 mb-md-4 sticky-top" style={{ top: '10px', zIndex: '1020' }}>
          <div className="card-body p-2 p-md-3">
            {/* DESKTOP LAYOUT */}
            <div className="d-none d-md-block">
              <div className="row g-2 g-md-3 align-items-end">

                {/* LEFT SIDE: Search + Filters */}
                <div className="col-12 col-lg-7">
                  <div className="row g-2">
                    {/* Search */}
                    <div className="col-12 col-md-6">
                      <SearchInput
                        value={search}
                        onChange={(val) => {
                          setSearch(val);
                          setCurrentPage(1);
                        }}
                        placeholder="Search salons..."
                      />
                    </div>

                    {/* City Filter */}
                    <div className="col-6 col-md-3">
                      <select
                        className="form-select form-select-sm"
                        value={cityFilter}
                        onChange={(e) => { setCityFilter(e.target.value); setCurrentPage(1); }}
                      >
                        <option value="all">All Cities</option>
                        {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div className="col-6 col-md-3">
                      <select
                        className="form-select form-select-sm"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE: Pagination + Add Button - FIXED */}
                <div className="col-12 col-lg-5 d-flex flex-column flex-md-row gap-2 justify-content-end align-items-end pagination-right-section">
                  {/* Pagination */}
                  <div className="d-flex justify-content-end flex-fill order-md-1 me-md-2 pagination-container">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.max(totalPages || 0)}
                      onPageChange={setCurrentPage}
                      size="sm"
                    />
                  </div>

                  {/* Add Button */}
                  <button
                    className="btn btn-sm order-md-2 flex-shrink-0 buttoncolor ms-md-2"
                    onClick={handleAddSalon}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.25rem',
                      minWidth: 'auto',
                      width: 'auto',
                      maxWidth: 'fit-content'
                    }}
                    title="Add New Salon"
                  >
                    <i className="bi bi-plus"></i>
                    <span className="d-none d-md-inline  p-1">Add Salon</span>
                    <span className="d-md-none   d-sm-inline">Add</span>
                    {/* <span className="d-sm-none">+</span> */}
                  </button>
                </div>
              </div>
            </div>

            {/* MOBILE LAYOUT */}
            <div className="d-md-none">
              <div className="d-flex flex-column gap-2">
                {/* Row 1: Filter Button (small) | Search (flex-grow) */}
                <div className="row g-2 align-items-center">
                  <div className="col-auto">
                    <button
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                      onClick={() => setShowMobileFilters(!showMobileFilters)}
                      type="button"
                      style={{ minWidth: 'auto', padding: '0.25rem 0.5rem' }}
                    >
                      <i className="fa-solid fa-filter"></i>
                      {(cityFilter !== "all" || statusFilter !== "all") ? (
                        <span className="badge bg-secondary ms-1" style={{ fontSize: '0.65rem', padding: '0.15rem 0.3rem' }}>!</span>
                      ) : null}
                      {/* <i className={`bi bi-chevron-${showMobileFilters ? 'up' : 'down'} ms-1`}></i> */}
                    </button>
                  </div>
                  <div className="col">
                    <SearchInput
                      value={search}
                      onChange={(val) => {
                        setSearch(val);
                        setCurrentPage(1);
                      }}
                      placeholder="Search..."
                    />
                  </div>
                </div>

                {/* Collapsible Filters */}
                {showMobileFilters && (
                  <div className="card border-0 bg-light">
                    <div className="card-body p-2">
                      <div className="d-flex flex-column gap-2">
                        {/* City Filter */}
                        <div>
                          <label className="form-label small mb-1 fw-semibold">All Cities</label>
                          <select
                            className="form-select form-select-sm"
                            value={cityFilter}
                            onChange={(e) => { setCityFilter(e.target.value); setCurrentPage(1); }}
                          >
                            <option value="all">All Cities</option>
                            {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                          </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                          <label className="form-label small mb-1 fw-semibold">All Status</label>
                          <select
                            className="form-select form-select-sm"
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                          >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Row 2: Pagination + Add Button */}
                <div className="row  g-3 align-items-center">
                  <div className="col-9 d-flex justify-content-end">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.max(totalPages || 0)}
                      onPageChange={setCurrentPage}
                      size="sm"
                    />
                  </div>
                  <div className="col-2 d-flex">
                    <button
                      className="btn btn-sm flex-shrink-0 buttoncolor"
                      onClick={handleAddSalon}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        minWidth: 'auto',
                        width: 'auto',
                        maxWidth: 'fit-content'
                      }}
                      title="Add New Salon"
                    >
                      <i className="bi bi-plus"></i>
                      <span className="d-sm-inline">Add</span>
                      {/* <span className="d-sm-none">+</span> */}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {paginated.length === 0 && (
          <div className="alert alert-light text-center py-5 shadow-sm">
            <p className="mb-0 text-muted">No salons found matching your criteria.</p>
          </div>
        )}

        {/* Salons Grid */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-2 g-md-3 mb-4"
          style={{
            maxHeight: '80vh',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#6C8A88 #E5EFFEE'
          }}>
          {paginated.map((salon) => (
            <div className="col" key={salon.id}>
              <div className="card h-100 shadow-sm border-0 hover-lift-sm transition-all position-relative"
                style={{
                  cursor: 'pointer',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  fontSize: '0.9rem'
                }}
                onClick={() => navigate(`/salons/${salon.id}`)}>

                {salon.images?.[0] && (
                  <div className="ratio ratio-16x9">
                    <img src={salon.images[0]}
                      className="card-img-top"
                      alt={salon.name}
                      style={{ objectFit: "cover" }} />
                  </div>
                )}

                <div className="card-body p-2 p-md-3">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="card-title mb-0 fw-bold text-truncate" style={{ fontSize: '0.95rem' }}>
                      {salon.name}
                    </h6>
                    <span className="badge bg-warning-subtle text-dark border-0 p-1" style={{ fontSize: '0.75rem' }}>
                      ★ {salon.rating}
                    </span>
                  </div>
                  <div className="text-muted mb-2 small">
                    <i className="bi bi-geo-alt me-1"></i>
                    {salon.city}
                  </div>
                  <div className="mt-auto">
                    <StatusBadge status={salon.status} size="sm" />
                  </div>
                </div>

                <div className="card-footer bg-transparent border-top-0 py-2 px-3">
                  <div className="d-flex justify-content-between align-items-center text-muted small mb-2">
                    <span>{salon.services.length} Services</span>
                    <span>{salon.openingTime}</span>
                  </div>

                  {/* EDIT BUTTON */}
                  <button
                    className="btn btn-sm w-100"
                    style={{
                      backgroundColor: '#e1b378',
                      borderColor: '#e1b378',
                      color: '#000',
                      fontSize: '0.8rem'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSalon(salon);
                    }}
                  >
                    <i className="bi bi-pencil me-1"></i>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMPLETE ADD & EDIT MODAL */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: '40%', margin: '1rem auto' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className={`bi ${modalMode === "add" ? "bi-plus-circle text-primary" : "bi-pencil-square text-warning"} me-2`}></i>
                  {modalMode === "add" ? "Add New Salon" : "Edit Salon"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  // scrollbarWidth= "thin"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <div className="row g-3 g-md-4" style={{ minHeight: 0 }}>

                    {/* 1. Salon Name */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Salon Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        placeholder="Enter salon name"
                      />
                    </div>

                    {/* 2. Owner Name */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Owner Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ownerName"
                        value={formData.ownerName || ""}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        placeholder="Enter owner name"
                      />
                    </div>

                    {/* 3. Phone Number */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Phone Number <span className="text-danger">*</span></label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phoneNumber"
                        value={formData.phoneNumber || ""}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        placeholder="Enter Phone Number"
                      />
                    </div>

                    {/* 4. Email ID */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Email ID</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        placeholder="owner@example.com"
                      />
                    </div>

                    {/* 5. Address Line */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">Address Line <span className="text-danger">*</span></label>
                      <textarea
                        className="form-control"
                        name="address"
                        rows="2"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        placeholder="Enter complete address"
                      />
                    </div>

                    {/* 6. City */}
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">City <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    {/* 7. State */}
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">State <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="state"
                        value={formData.state || ""}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select State</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Rajasthan">Rajasthan</option>
                      </select>
                    </div>

                    {/* 8. Pincode */}
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">Pincode <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        name="pincode"
                        value={formData.pincode || ""}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        placeholder="124001"
                        maxLength="6"
                      />
                    </div>

                    {/* Salon Type */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold mb-2">Salon Type : <span className="text-danger">*</span></label>
                      <div className="d-flex flex-column gap-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="male"
                            value="male"
                            checked={formData.gender === "male"}
                            onChange={handleInputChange}
                            required
                            disabled={isSubmitting}
                          />
                          <label className="form-check-label fw-medium" htmlFor="male">
                            <i className="bi bi-person-fill text-primary me-2"></i>Male
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="female"
                            value="female"
                            checked={formData.gender === "female"}
                            onChange={handleInputChange}
                            required
                            disabled={isSubmitting}
                          />
                          <label className="form-check-label fw-medium" htmlFor="female">
                            <i className="bi bi-person-heart text-danger me-2"></i>Female
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="unisex"
                            value="unisex"
                            checked={formData.gender === "unisex"}
                            onChange={handleInputChange}
                            required
                            disabled={isSubmitting}
                          />
                          <label className="form-check-label fw-medium" htmlFor="unisex">
                            <i className="bi bi-gender-trans text-success me-2"></i>Unisex
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Services <span className="text-danger">*</span></label>
                      {formData.services.map((service, index) => (
                        <div key={index} className="card mb-3 p-3">
                          <div className="mb-2">
                            <div className="row g-2">
                              <div className="col-12 col-md-4">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Service Name"
                                  value={service.name}
                                  onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                                  required
                                />
                              </div>
                              <div className="col-12 col-md-4">
                                <div className="input-group">
                                  <span className="input-group-text"><i className="bi bi-currency-rupee"></i></span>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Price"
                                    value={service.price}
                                    onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-md-4">
                                <div className="input-group">
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Duration"
                                    value={service.duration}
                                    onChange={(e) => handleServiceChange(index, 'duration', e.target.value)}
                                    required
                                  />
                                  <span className="input-group-text">min</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2">
                              <textarea
                                className="form-control"
                                placeholder="Description"
                                value={service.description}
                                onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removeService(index)}
                            disabled={formData.services.length === 1}
                          >
                            <i className="bi bi-trash"></i> Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="bg"
                        onClick={addService}
                      >
                        Add Service
                      </button>
                    </div>

                    {/* Opening Time */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        Opening Time <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          type="time"
                          className="form-control rounded-start"
                          name="openingTime"
                          value={formData.openingTime || ""}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                        <select
                          className="form-select rounded-end"
                          style={{ maxWidth: "100px" }}
                          name="openingPeriod"
                          value={formData.openingPeriod || "AM"}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>

                    {/* Closing Time */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        Closing Time <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          type="time"
                          className="form-control rounded-start"
                          name="closingTime"
                          value={formData.closingTime || ""}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                        <select
                          className="form-select rounded-end"
                          style={{ maxWidth: "100px" }}
                          name="closingPeriod"
                          value={formData.closingPeriod || "PM"}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>



                    {/* Working Day */}
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">
                        Day <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="day"
                        value={formData.day}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select Day</option>
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                        <option value="saturday">Saturday</option>
                        <option value="sunday">Sunday</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={formData.description || ""}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        placeholder="Enter service details..."
                      />
                    </div>

                    {/* Images */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">Salon Images</label>
                      <div className="position-relative">
                        <input
                          type="file"
                          id="file-upload-box"
                          className="d-none"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          disabled={isSubmitting}
                        />
                        <label
                          htmlFor="file-upload-box"
                          className="d-flex flex-column align-items-center justify-content-center p-4 border rounded bg-light text-secondary cursor-pointer w-50"
                          style={{ borderStyle: 'dashed !important', borderWidth: '2px', cursor: 'pointer' }}
                        >
                          <div className="mb-2 p-3 rounded-circle bg-white shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.614 14.118 11.002 12.244 11.002h-2.026a.5.5 0 0 1-.5-.5V7.854l1.646 1.647a.5.5 0 0 0 .708-.708l-2.5-2.5a.5.5 0 0 0-.708 0l-2.5 2.5a.5.5 0 1 0 .708.708L7.5 7.854V10.5a.5.5 0 0 1-.5.5h-1.793c-2.112 0-3.518-1.559-3.518-3.468C1.696 5.996 2.825 4.515 4.406 1.342z" />
                            </svg>
                          </div>
                          <span className="fw-medium text-dark">Click to upload images</span>
                        </label>
                      </div>

                      {formData.images.length > 0 && (
                        <div className="row g-2 mt-3">
                          {formData.images.map((image, index) => (
                            <div key={index} className="col-4 col-sm-3 col-md-2 position-relative">
                              <img
                                src={image.preview}
                                className="img-fluid rounded shadow-sm border w-100"
                                style={{ height: '80px', objectFit: 'cover', display: 'block' }}
                                alt={`Preview ${index + 1}`}
                              />
                              <button
                                type="button"
                                className="position-absolute top-0 end-0 m-1 btn btn-danger btn-sm p-0 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                style={{ width: '20px', height: '20px', lineHeight: 1 }}
                                onClick={() => removeImage(index)}
                                disabled={isSubmitting}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                <div className="modal-footer d-flex flex-sm-row gap-2 gap-sm-0">
                  <button
                    type="button"
                    className="btn btn-secondary order-2 order-sm-1"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="buttoncolor position-relative order-1 order-sm-2"
                    disabled={isSubmitting}
                  >
                    <span className="d-flex align-items-center">
                      <i className={`bi ${isSubmitting ? 'bi-hourglass-split' : 'bi-check-circle'} me-1`}></i>
                      {isSubmitting ? (modalMode === "add" ? 'Adding...' : 'Updating...') : (modalMode === "add" ? 'Add Salon' : 'Update Salon')}
                    </span>
                    {isSubmitting && (
                      <div className="spinner-border spinner-border-sm ms-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default Salons;
