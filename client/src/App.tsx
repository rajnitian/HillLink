
import {
  findMatchingDonors,
  type BloodGroup,
  type Donor,
} from "./donorMatching";

import {
  assignNearestAmbulance,
  type Ambulance,
  type AmbulanceAssignment,
} from "./ambulanceCoordination";

type RequestStatus = "Urgent" | "Pending" | "Matched" | "Completed";

type BloodRequest = {
  id: string;
  bloodGroup: string;
  component: string;
  units: number;
  hospital: string;
  location: string;
  deadline: string;
  status: RequestStatus;
};

const initialRequests: BloodRequest[] = [
  {
    id: "HL-1024",
    bloodGroup: "O-",
    component: "Whole blood",
    units: 2,
    hospital: "City General Hospital",
    location: "Central Guwahati",
    deadline: "Within 2 hours",
    status: "Urgent",
  },
  {
    id: "HL-1023",
    bloodGroup: "B+",
    component: "Packed red cells",
    units: 1,
    hospital: "Hillview Medical Centre",
    location: "Dispur",
    deadline: "Within 5 hours",
    status: "Matched",
  },
  {
    id: "HL-1022",
    bloodGroup: "A+",
    component: "Platelets",
    units: 2,
    hospital: "Regional Hospital",
    location: "Jalukbari",
    deadline: "Within 6 hours",
    status: "Pending",
  },
];

const demoDonors = [
  {
    name: "Donor A",
    group: "O-",
    distance: "2.4 km",
    eta: "12 min",
    status: "Available in demo",
  },
  {
    name: "Donor B",
    group: "O-",
    distance: "4.1 km",
    eta: "19 min",
    status: "Awaiting confirmation",
  },
  {
    name: "Donor C",
    group: "O-",
    distance: "6.8 km",
    eta: "27 min",
    status: "Awaiting confirmation",
  },
];

const demoAmbulances: Ambulance[] = [
  {
    id: "AMB-01",
    vehicleNumber: "DEMO-101",
    available: true,
    distanceKm: 3.2,
  },
  {
    id: "AMB-02",
    vehicleNumber: "DEMO-102",
    available: true,
    distanceKm: 6.5,
  },
];


type Page = "Overview" | "Blood requests" | "Donors" | "Ambulances";

function App() {
  const [page, setPage] = useState<Page>("Overview");
  const [requests, setRequests] = useState(initialRequests);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");

  const [bloodGroup, setBloodGroup] = useState("O-");
  const [component, setComponent] = useState("Packed red cells");
  const [units, setUnits] = useState(1);
  const [hospital, setHospital] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("2 hours");
  const [contact, setContact] = useState("");

  const urgentCount = requests.filter(
    (request) => request.status === "Urgent"
  ).length;

  function createRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newRequest: BloodRequest = {
      id: `HL-${Date.now().toString().slice(-6)}`,
      bloodGroup,
      component,
      units,
      hospital: hospital.trim(),
      location: location.trim(),
      deadline: `Within ${deadline}`,
      status: "Pending",
    };

    setRequests((current) => [newRequest, ...current]);
    setShowForm(false);
    setPage("Blood requests");
    setNotice(
      `Demo request ${newRequest.id} created. Hospital verification and donor alerts are not enabled.`
    );

    setHospital("");
    setLocation("");
    setContact("");
    setUnits(1);
  }

  function updateStatus(id: string, status: RequestStatus) {
    setRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
    setNotice(`Request ${id} updated in this demo session.`);
  }

  const navigation: Page[] = [
    "Overview",
    "Blood requests",
    "Donors",
    "Ambulances",
  ];

  return (
    <div className="hilllink-app">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(event) => {
          event.preventDefault();
          setPage("Overview");
        }}>
          <span className="brand-icon">H+</span>
          <span>
            <strong>HillLink</strong>
            <small>Emergency coordination</small>
          </span>
        </a>

        <div className="nav-label">WORKSPACE</div>

        <nav className="navigation" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              key={item}
              className={`nav-item ${page === item ? "active" : ""}`}
              onClick={() => setPage(item)}
            >
              <span className="nav-symbol">
                {item === "Overview"
                  ? "◫"
                  : item === "Blood requests"
                    ? "✚"
                    : item === "Donors"
                      ? "♡"
                      : "＋"}
              </span>
              {item}
              {item === "Blood requests" && urgentCount > 0 && (
                <span className="nav-count">{urgentCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="demo-card">
            <span className="demo-dot" />
            <strong>Demo environment</strong>
            <p>Sample records only. No real emergency alerts are sent.</p>
          </div>
          <div className="profile">
            <div className="avatar">HD</div>
            <div>
              <strong>Hospital dashboard</strong>
              <small>Demo operator</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>HillLink</span>
            <span>/</span>
            <strong>{page}</strong>
          </div>
          <div className="topbar-right">
            <span className="demo-label">DEMO MODE</span>
            <span className="connection-label">
              <span className="connection-dot" />
              Local session
            </span>
          </div>
        </header>

        <div className="page-content">
          {notice && (
            <div className="notice" role="status">
              <span>{notice}</span>
              <button
                className="notice-close"
                onClick={() => setNotice("")}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          )}

          {page === "Overview" && (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow">EMERGENCY RESPONSE WORKSPACE</div>
                  <h1>Every minute matters.</h1>
                  <p className="page-description">
                    Coordinate blood requests, potential donors, and ambulance
                    availability from one place.
                  </p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => setShowForm(true)}
                >
                  <span>＋</span> New blood request
                </button>
              </section>

              <section className="stats-grid" aria-label="Request statistics">
                <StatCard
                  label="Active requests"
                  value={String(requests.length)}
                  detail="Demo records"
                  symbol="▤"
                />
                <StatCard
                  label="Urgent requests"
                  value={String(urgentCount)}
                  detail="Require attention"
                  symbol="!"
                  highlight
                />
                <StatCard
                  label="Potential donors"
                  value="3"
                  detail="Sample donor records"
                  symbol="♡"
                />
                <StatCard
                  label="Ambulances"
                  value="2"
                  detail="Sample fleet records"
                  symbol="＋"
                />
              </section>

              <section className="content-grid">
                <div className="panel requests-panel">
                  <div className="panel-header">
                    <div>
                      <h2>Recent blood requests</h2>
                      <p>Review and update demo requests.</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => setPage("Blood requests")}
                    >
                      View all →
                    </button>
                  </div>
                  <RequestList
                    requests={requests.slice(0, 4)}
                    onStatusChange={updateStatus}
                  />
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Coordination map</h2>
                      <p>Location overview</p>
                    </div>
                    <span className="map-pin">⌖</span>
                  </div>
                  <div className="map-placeholder">
                    <div className="map-road road-one" />
                    <div className="map-road road-two" />
                    <div className="map-road road-three" />
                    <div className="map-water" />
                    <div className="map-marker marker-one">H</div>
                    <div className="map-marker marker-two">+</div>
                    <div className="map-marker marker-three">A</div>
                    <div className="map-caption">
                      <strong>Guwahati region</strong>
                      <span>Illustrative map · Not live navigation</span>
                    </div>
                  </div>
                  <p className="map-note">
                    Live road routing, traffic, and GPS require additional
                    map-service integration.
                  </p>
                </div>
              </section>

              <section className="panel workflow-panel">
                <div className="panel-header">
                  <div>
                    <h2>Emergency coordination workflow</h2>
                    <p>How a request moves through HillLink</p>
                  </div>
                </div>
                <div className="workflow-grid">
                  <WorkflowStep
                    number="01"
                    title="Create request"
                    description="Enter the blood requirement, hospital, and deadline."
                  />
                  <WorkflowStep
                    number="02"
                    title="Verify details"
                    description="Confirm the requester and hospital before contacting donors."
                  />
                  <WorkflowStep
                    number="03"
                    title="Match donors"
                    description="Check compatibility, consent, availability, and travel estimates."
                  />
                  <WorkflowStep
                    number="04"
                    title="Coordinate transport"
                    description="A dispatcher reviews ambulance availability and approves dispatch."
                  />
                </div>
              </section>
            </>
          )}

          {page === "Blood requests" && (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow">REQUEST MANAGEMENT</div>
                  <h1>Blood requests</h1>
                  <p className="page-description">
                    Track requirements, deadlines, and request status.
                  </p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => setShowForm(true)}
                >
                  ＋ New request
                </button>
              </section>
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>All requests</h2>
                    <p>{requests.length} requests in this demo session</p>
                  </div>
                </div>
                <RequestList
                  requests={requests}
                  onStatusChange={updateStatus}
                />
              </section>
            </>
          )}

          {page === "Donors" && (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow">DONOR COORDINATION</div>
                  <h1>Potential donors</h1>
                  <p className="page-description">
                    Example donor matches for an O-negative request.
                  </p>
                </div>
                <span className="demo-label">SAMPLE DATA</span>
              </section>
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Suggested donor list</h2>
                    <p>
                      Illustrative distances and ETAs, not live locations or
                      confirmed availability.
                    </p>
                  </div>
                </div>
                <div className="donor-list">
                  {demoDonors.map((donor) => (
                    <div className="donor-row" key={donor.name}>
                      <div className="avatar donor-avatar">♡</div>
                      <div className="donor-main">
                        <strong>{donor.name}</strong>
                        <span>{donor.status}</span>
                      </div>
                      <div className="donor-detail">
                        <small>Blood group</small>
                        <strong>{donor.group}</strong>
                      </div>
                      <div className="donor-detail">
                        <small>Distance</small>
                        <strong>{donor.distance}</strong>
                      </div>
                      <div className="donor-detail">
                        <small>Illustrative ETA</small>
                        <strong>{donor.eta}</strong>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="safety-note">
                  Blood group compatibility alone does not establish medical
                  eligibility. Qualified staff and the hospital blood bank
                  must confirm suitability. No donor notifications are sent.
                </p>
              </section>
            </>
          )}

          {page === "Ambulances" && (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow">TRANSPORT COORDINATION</div>
                  <h1>Ambulance coordination</h1>
                  <p className="page-description">
                    Review example fleet records before dispatch approval.
                  </p>
                </div>
                <span className="demo-label">SAMPLE DATA</span>
              </section>
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Available fleet records</h2>
                    <p>Example information for the interface preview.</p>
                  </div>
                </div>
                <div className="ambulance-grid">
                  <AmbulanceCard
                    id="AMB-01"
                    base="Central station"
                    status="Demo available"
                    eta="14 min"
                  />
                  <AmbulanceCard
                    id="AMB-02"
                    base="North station"
                    status="Demo available"
                    eta="22 min"
                  />
                </div>
                <p className="safety-note">
                  These are not live vehicles. Real dispatch requires verified
                  locations, availability rechecks, route feasibility, and
                  explicit dispatcher approval.
                </p>
              </section>
            </>
          )}

          <footer className="footer">
            <span>HillLink · Emergency coordination</span>
            <span>Prototype · No live emergency services connected</span>
          </footer>
        </div>
      </main>

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <section
            className="request-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-modal-title"
          >
            <div className="modal-header">
              <div>
                <div className="eyebrow">NEW EMERGENCY REQUEST</div>
                <h2 id="request-modal-title">Blood requirement details</h2>
                <p>Fields marked * are required.</p>
              </div>
              <button
                className="close-button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={createRequest}>
              <div className="form-grid">
                <label>
                  Blood group *
                  <select
                    value={bloodGroup}
                    onChange={(event) => setBloodGroup(event.target.value)}
                  >
                    {["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"].map(
                      (group) => (
                        <option key={group}>{group}</option>
                      )
                    )}
                  </select>
                </label>

                <label>
                  Blood component *
                  <select
                    value={component}
                    onChange={(event) => setComponent(event.target.value)}
                  >
                    <option>Packed red cells</option>
                    <option>Whole blood</option>
                    <option>Platelets</option>
                    <option>Plasma</option>
                  </select>
                </label>

                <label>
                  Units required *
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={units}
                    onChange={(event) => setUnits(Number(event.target.value))}
                    required
                  />
                </label>

                <label>
                  Required within *
                  <select
                    value={deadline}
                    onChange={(event) => setDeadline(event.target.value)}
                  >
                    <option value="30 minutes">30 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                    <option value="5 hours">5 hours</option>
                    <option value="12 hours">12 hours</option>
                    <option value="24 hours">24 hours</option>
                  </select>
                </label>

                <label className="full-width">
                  Hospital or medical facility *
                  <input
                    value={hospital}
                    onChange={(event) => setHospital(event.target.value)}
                    placeholder="Enter hospital name"
                    required
                    maxLength={120}
                  />
                </label>

                <label className="full-width">
                  Hospital location *
                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Area, town, or address"
                    required
                    maxLength={200}
                  />
                </label>

                <label className="full-width">
                  Requester contact number
                  <input
                    type="tel"
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    placeholder="Optional in this UI demo"
                    maxLength={20}
                  />
                </label>
              </div>

              <div className="form-warning">
                <strong>Demo only.</strong> Creating this form adds a local
                sample request. It does not verify a hospital, contact donors,
                or contact emergency services.
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Create demo request
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  symbol,
  highlight = false,
}: {
  label: string;
  value: string;
  detail: string;
  symbol: string;
  highlight?: boolean;
}) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className={`stat-symbol ${highlight ? "urgent-symbol" : ""}`}>
          {symbol}
        </span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-detail">{detail}</div>
    </article>
  );
}

function RequestList({
  requests,
  onStatusChange,
}: {
  requests: BloodRequest[];
  onStatusChange: (id: string, status: RequestStatus) => void;
}) {
  if (requests.length === 0) {
    return <p className="empty-state">No requests have been created yet.</p>;
  }

  return (
    <div className="request-list">
      {requests.map((request) => (
        <article className="request-row" key={request.id}>
          <div className="blood-badge">{request.bloodGroup}</div>
          <div className="request-main">
            <div className="request-title">
              <strong>{request.hospital}</strong>
              <span className={`status-badge status-${request.status.toLowerCase()}`}>
                {request.status}
              </span>
            </div>
            <span className="request-subtitle">
              {request.id} · {request.component} · {request.units} unit(s)
            </span>
            <span className="request-location">
              ⌖ {request.location} · {request.deadline}
            </span>
          </div>
          <label className="status-editor">
            <span>Demo status</span>
            <select
              aria-label={`Update status for ${request.id}`}
              value={request.status}
              onChange={(event) =>
                onStatusChange(request.id, event.target.value as RequestStatus)
              }
            >
              <option value="Urgent">Urgent</option>
              <option value="Pending">Pending</option>
              <option value="Matched">Matched</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
        </article>
      ))}
    </div>
  );
}

function WorkflowStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="workflow-step">
      <span className="workflow-number">{number}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

function AmbulanceCard({
  id,
  base,
  status,
  eta,
}: {
  id: string;
  base: string;
  status: string;
  eta: string;
}) {
  return (
    <article className="ambulance-card">
      <div className="ambulance-icon">＋</div>
      <div className="ambulance-info">
        <strong>{id}</strong>
        <span>{base}</span>
        <span>{status}</span>
      </div>
      <div className="ambulance-eta">
        <small>Sample ETA</small>
        <strong>{eta}</strong>
      </div>
    </article>
  );
}

export default App;
