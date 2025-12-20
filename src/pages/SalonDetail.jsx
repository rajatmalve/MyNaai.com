import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { salons } from "../data/mockData.js";

const SalonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const salon = salons.find((s) => s.id === id);

  if (!salon) return <Layout><div className="text-center py-5"><h4>Salon not found</h4></div></Layout>;

  const galleryImages = [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1621605815841-aa897bd40742?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1595476108010-b4d1f8c2b1b1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
  ];

  const PAGE_MAX_WIDTH = '1400px';

  return (
    <Layout>
      {/* Wrapper to control total height */}
      <div className="d-flex flex-column" style={{ height: 'calc(100vh - 100px)', maxWidth: PAGE_MAX_WIDTH, margin: '27px' }}>

        {/* 1. Header Section */}
        <div className="card shadow-sm mb-3 border-0"
          style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px' }}>
          <div className="card-body p-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-light btn-sm rounded-circle shadow-sm" onClick={() => navigate('/salons')}>
                <i className="bi bi-arrow-left"></i>
              </button>
              <div>
                <h4 className="mb-0 fw-bold">{salon.name}</h4>
                <small className="text-muted">{salon.city} • ★ {salon.rating}</small>
              </div>
            </div>
            <StatusBadge status={salon.status} />
          </div>
        </div>

        {/* Main Content Area - Taking remaining height */}
        <div className="flex-grow-1 overflow-hidden">
          <div className="row g-3 h-100">

            {/* Left Column: Gallery & Hours */}
            <div className="col-lg-7 d-flex flex-column h-100">
              {/* Gallery (Scrollable) */}
              <div className="card shadow-sm border-0 mb-3 flex-grow-1 overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="card-body d-flex flex-column h-100">
                  <h6 className="fw-bold mb-2 small"><i className="bi bi-images me-2 text-primary"></i>Gallery</h6>
                  <div className="overflow-auto pe-1 thin-scrollbar">
                    <div className="row g-2">
                      {galleryImages.map((img, idx) => (
                        <div key={idx} className={idx % 3 === 0 ? "col-12" : "col-6"}>
                          <img src={img} className="img-fluid rounded-3 w-100" style={{ height: '180px', objectFit: 'cover' }} alt="salon" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours (Fixed height at bottom of left column) */}
              <div className="card shadow-sm border-0 bg text-white" style={{ borderRadius: '15px', height: '180px' }}>
                <div className="card-body d-flex flex-column justify-content-center text-center p-3">
                  <h6 className="small opacity-75 text-start"><i className="bi bi-clock me-2"></i>Business Hours</h6>
                  <h2 className="fw-bold mb-1">{salon.openingTime} - {salon.closingTime}</h2>
                  <div className="d-flex flex-wrap justify-content-center gap-1 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <span
                        key={i}
                        className={`badge ${day === 'Sun' ? 'bg-danger' : 'bg-white bg-opacity-25'}`}
                        style={{ fontSize: '10px' }}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Services & Contact */}
            <div className="col-lg-5 d-flex flex-column h-100">
              {/* Services (Scrollable) */}
              <div className="card shadow-sm border-0 mb-3 flex-grow-1 overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="card-body p-0 d-flex flex-column h-100">
                  <div className="p-3 border-bottom bg-light">
                    <h6 className="fw-bold mb-0 small">Services</h6>
                  </div>
                  <div className="list-group list-group-flush overflow-auto thin-scrollbar">
                    {salon.services.map((s) => (
                      <div key={s.id} className="list-group-item p-3 d-flex justify-content-between">
                        <div><div className="fw-bold small">{s.name}</div><small className="text-muted">{s.duration}m</small></div>
                        <div className="fw-bold text-primary">₹{s.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact (Fixed height at bottom of right column) */}
              <div className="card shadow-sm border-0" style={{ borderRadius: '15px', height: '220px' }}>
                <div className="card-body d-flex flex-column p-3">
                  <h6 className="fw-bold mb-2 small border-bottom pb-1">Contact</h6>
                  <div className="flex-grow-1">
                    <p className="x-small mb-1 text-muted"><i className="bi bi-geo-alt text-danger me-2"></i>{salon.address}</p>
                    <p className="x-small mb-1 text-muted"><i className="bi bi-phone text-success me-2"></i>{salon.phone}</p>
                  </div>
                  <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-dark btn-sm flex-grow-1 rounded-pill">Email</button>
                    <button className="btn bg btn-sm flex-grow-1 rounded-pill">WhatsApp</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SalonDetail;