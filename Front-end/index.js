const typingText = document.getElementById("typingText");
const attendanceTable = document.getElementById("attendanceTable");
const emptyFeed = document.getElementById("emptyFeed");
const liveClock = document.getElementById("liveClock");
const cameraClock = document.getElementById("cameraClock");
const aiCameraPanel = document.getElementById("aiCameraPanel");
const cameraStudentPhoto = document.getElementById("cameraStudentPhoto");
const identityPhoto = document.getElementById("identityPhoto");
const identityName = document.getElementById("identityName");
const identityId = document.getElementById("identityId");
const identityDepartment = document.getElementById("identityDepartment");
const identitySection = document.getElementById("identitySection");
const aiStatusText = document.getElementById("aiStatusText");
const aiStatusDetail = document.getElementById("aiStatusDetail");
const statusIcon = document.getElementById("statusIcon");

const presentCount = document.getElementById("presentCount");
const absentCount = document.getElementById("absentCount");
const softwarePresent = document.getElementById("softwarePresent");
const softwareAbsent = document.getElementById("softwareAbsent");
const cseAPresent = document.getElementById("cseAPresent");
const cseAAbsent = document.getElementById("cseAAbsent");
const cseBPresent = document.getElementById("cseBPresent");
const cseBAbsent = document.getElementById("cseBAbsent");
const presentBar = document.getElementById("presentBar");
const absentBar = document.getElementById("absentBar");
const softwareBar = document.getElementById("softwareBar");
const cseABar = document.getElementById("cseABar");
const cseBBar = document.getElementById("cseBBar");

const TOTAL_STUDENTS = 120;
const MAX_ROWS = 8;

const typeSequence = [
  "AI biometric attendance system",
  "Real-time campus intelligence",
  "Secure face verification"
];

const studentPool = [
  {
    name: "Rakib Hasan Piyas",
    id: "242-35-182",
    department: "Software Engineering",
    section: "Section F",
    group: "software",
    photo: "https://i.pravatar.cc/640?img=12"
  },
  {
    name: "Test",
    id: "242-35-182",
    department: "Software Engineering",
    section: "Section F",
    group: "software",
    photo: "https://i.pravatar.cc/640?img=12"
  },
  {
    name: "Nusrat Jahan",
    id: "242-15-201",
    department: "Computer Science & Engineering",
    section: "Section A",
    group: "cseA",
    photo: "https://i.pravatar.cc/640?img=47"
  },
  {
    name: "Arif Hossain",
    id: "242-15-219",
    department: "Computer Science & Engineering",
    section: "Section B",
    group: "cseB",
    photo: "https://i.pravatar.cc/640?img=15"
  },
  {
    name: "Sadia Islam",
    id: "242-35-186",
    department: "Software Engineering",
    section: "Section A",
    group: "software",
    photo: "https://i.pravatar.cc/640?img=5"
  },
  {
    name: "Mahin Chowdhury",
    id: "242-15-223",
    department: "Computer Science & Engineering",
    section: "Section B",
    group: "cseB",
    photo: "https://i.pravatar.cc/640?img=24"
  },
  {
    name: "Tanvir Ahmed",
    id: "242-15-209",
    department: "Computer Science & Engineering",
    section: "Section A",
    group: "cseA",
    photo: "https://i.pravatar.cc/640?img=18"
  },
  {
    name: "Rafi Ahmed",
    id: "242-35-198",
    department: "Software Engineering",
    section: "Section A",
    group: "software",
    photo: "https://i.pravatar.cc/640?img=31"
  },
  {
    name: "Shanto Das",
    id: "242-15-230",
    department: "Computer Science & Engineering",
    section: "Section B",
    group: "cseB",
    photo: "https://i.pravatar.cc/640?img=40"
  }
];

const attendanceGroups = {
  software: {
    total: 50,
    presentElement: softwarePresent,
    absentElement: softwareAbsent,
    progressElement: softwareBar
  },
  cseA: {
    total: 35,
    presentElement: cseAPresent,
    absentElement: cseAAbsent,
    progressElement: cseABar
  },
  cseB: {
    total: 35,
    presentElement: cseBPresent,
    absentElement: cseBAbsent,
    progressElement: cseBBar
  }
};

const phaseDetails = {
  scanning: {
    title: "Scanning Face...",
    detail: "Analyzing facial landmarks and camera motion",
    icon: "fa-expand"
  },
  detected: {
    title: "Face Detected ✓",
    detail: "Face geometry captured with high confidence",
    icon: "fa-face-smile"
  },
  liveness: {
    title: "Checking Liveness...",
    detail: "Validating natural movement and depth response",
    icon: "fa-shield-halved"
  },
  verified: {
    title: "Liveness Verified ✓",
    detail: "Live biometric signature confirmed",
    icon: "fa-shield-heart"
  },
  recognizing: {
    title: "Recognizing Face...",
    detail: "Matching encrypted facial template with campus records",
    icon: "fa-microchip"
  },
  matched: {
    title: "Identity Matched ✓",
    detail: "Student profile securely retrieved from the campus registry",
    icon: "fa-user-check"
  },
  recorded: {
    title: "Attendance Recorded Successfully ✓",
    detail: "Live entry ledger and attendance statistics updated",
    icon: "fa-circle-check"
  },
  resetting: {
    title: "Live cycle complete",
    detail: "Preparing a fresh AI surveillance session",
    icon: "fa-rotate"
  }
};

let attendanceState = createInitialState();
const activeAnimations = new Map();
let simulationRun = 0;

function createInitialState() {
  return {
    present: 0,
    groups: {
      software: 0,
      cseA: 0,
      cseB: 0
    }
  };
}

function getTimeString() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function updateClocks() {
  const time = getTimeString();

  if (liveClock) {
    liveClock.textContent = time;
  }

  if (cameraClock) {
    cameraClock.textContent = time;
  }
}

function pause(duration) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function createAvatarFallback(student) {
  const initials = getInitials(student.name);
  const hue = student.group === "software" ? "190" : student.group === "cseA" ? "221" : "158";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" role="img" aria-label="${student.name}">
      <defs>
        <linearGradient id="background" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="hsl(${hue}, 82%, 56%)" />
          <stop offset="1" stop-color="hsl(${Number(hue) + 35}, 72%, 26%)" />
        </linearGradient>
      </defs>
      <rect width="220" height="220" rx="26" fill="url(#background)" />
      <circle cx="110" cy="77" r="43" fill="rgba(255,255,255,.85)" />
      <path d="M34 214c7-54 37-80 76-80s69 26 76 80" fill="rgba(5,18,36,.68)" />
      <text x="110" y="202" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="32" font-weight="700">${initials}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function setImageSource(image, student) {
  if (!image || !student) {
    return;
  }

  image.onerror = () => {
    image.onerror = null;
    image.src = createAvatarFallback(student);
  };
  image.src = student.photo;
  image.alt = `${student.name} in the AI camera feed`;
}

function setCurrentStudent(student, animate = true) {
  if (!student) {
    return;
  }

  if (cameraStudentPhoto) {
    if (animate) {
      cameraStudentPhoto.classList.add("is-changing");
      window.setTimeout(() => cameraStudentPhoto.classList.remove("is-changing"), 360);
    }
    setImageSource(cameraStudentPhoto, student);
  }

  if (identityPhoto) {
    setImageSource(identityPhoto, student);
    identityPhoto.alt = `${student.name} profile`;
  }

  if (identityName) {
    identityName.textContent = student.name;
  }

  if (identityId) {
    identityId.textContent = `ID: ${student.id}`;
  }

  if (identityDepartment) {
    identityDepartment.textContent = student.department;
  }

  if (identitySection) {
    identitySection.textContent = student.section;
  }
}

function setPhase(phase) {
  const detail = phaseDetails[phase];

  if (!detail) {
    return;
  }

  if (aiCameraPanel) {
    aiCameraPanel.dataset.phase = phase;
  }

  if (aiStatusText) {
    aiStatusText.textContent = detail.title;
  }

  if (aiStatusDetail) {
    aiStatusDetail.textContent = detail.detail;
  }

  if (statusIcon) {
    statusIcon.innerHTML = "";
    const icon = document.createElement("i");
    icon.className = `fa-solid ${detail.icon}`;
    icon.setAttribute("aria-hidden", "true");
    statusIcon.append(icon);
  }
}

function setNumber(element, value) {
  if (element) {
    element.textContent = Math.round(value).toString();
  }
}

function stopCounterAnimation(element) {
  const frame = activeAnimations.get(element);
  if (frame) {
    window.cancelAnimationFrame(frame);
    activeAnimations.delete(element);
  }
}

function animateNumber(element, from, to, duration = 700) {
  if (!element) {
    return;
  }

  stopCounterAnimation(element);
  element.classList.remove("is-updating");
  void element.offsetWidth;
  element.classList.add("is-updating");

  const startedAt = window.performance.now();
  const draw = (now) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    setNumber(element, from + (to - from) * eased);

    if (progress < 1) {
      activeAnimations.set(element, window.requestAnimationFrame(draw));
      return;
    }

    setNumber(element, to);
    activeAnimations.delete(element);
  };

  activeAnimations.set(element, window.requestAnimationFrame(draw));
  window.setTimeout(() => element.classList.remove("is-updating"), duration + 30);
}

function setProgress(element, value) {
  if (element) {
    element.style.setProperty("--fill", `${Math.max(0, Math.min(value, 100))}%`);
  }
}

function updateGroupSummary(groupName, previousValue, shouldAnimate) {
  const group = attendanceGroups[groupName];
  const currentValue = attendanceState.groups[groupName];
  const previousAbsent = group.total - previousValue;
  const currentAbsent = group.total - currentValue;

  if (shouldAnimate) {
    animateNumber(group.presentElement, previousValue, currentValue);
    animateNumber(group.absentElement, previousAbsent, currentAbsent);
  } else {
    setNumber(group.presentElement, currentValue);
    setNumber(group.absentElement, currentAbsent);
  }

  setProgress(group.progressElement, (currentValue / group.total) * 100);
}

function renderSummary(shouldAnimate = false, previousState = attendanceState) {
  const currentAbsent = TOTAL_STUDENTS - attendanceState.present;
  const previousAbsent = TOTAL_STUDENTS - previousState.present;

  if (shouldAnimate) {
    animateNumber(presentCount, previousState.present, attendanceState.present);
    animateNumber(absentCount, previousAbsent, currentAbsent);
  } else {
    setNumber(presentCount, attendanceState.present);
    setNumber(absentCount, currentAbsent);
  }

  setProgress(presentBar, (attendanceState.present / TOTAL_STUDENTS) * 100);
  setProgress(absentBar, (currentAbsent / TOTAL_STUDENTS) * 100);

  Object.keys(attendanceGroups).forEach((groupName) => {
    const groupChanged = attendanceState.groups[groupName] !== previousState.groups[groupName];
    updateGroupSummary(groupName, previousState.groups[groupName], shouldAnimate && groupChanged);
  });
}

function addCell(row, content) {
  const cell = document.createElement("td");
  cell.textContent = content;
  row.append(cell);
}

function createRow(student, arrivalTime) {
  const row = document.createElement("tr");
  row.className = "new-row";

  const photoCell = document.createElement("td");
  const photoWrap = document.createElement("div");
  photoWrap.className = "student-photo";
  const photo = document.createElement("img");
  photo.alt = `${student.name} profile`;
  photo.loading = "lazy";
  setImageSource(photo, student);
  photoWrap.append(photo);
  photoCell.append(photoWrap);
  row.append(photoCell);

  addCell(row, student.name);
  addCell(row, student.id);
  addCell(row, student.department);
  addCell(row, student.section);
  addCell(row, arrivalTime);

  const statusCell = document.createElement("td");
  const status = document.createElement("span");
  status.className = "status-pill";
  status.textContent = "Present";
  statusCell.append(status);
  row.append(statusCell);

  return row;
}

function addAttendanceRow(student) {
  if (!attendanceTable) {
    return;
  }

  attendanceTable.prepend(createRow(student, getTimeString()));

  while (attendanceTable.children.length > MAX_ROWS) {
    attendanceTable.lastElementChild.remove();
  }

  if (emptyFeed) {
    emptyFeed.classList.add("is-hidden");
  }
}

function recordAttendance(student) {
  const previousState = {
    present: attendanceState.present,
    groups: { ...attendanceState.groups }
  };

  attendanceState.present += 1;
  attendanceState.groups[student.group] += 1;

  addAttendanceRow(student);
  renderSummary(true, previousState);
}

function resetDemo() {
  attendanceState = createInitialState();

  activeAnimations.forEach((frame) => window.cancelAnimationFrame(frame));
  activeAnimations.clear();
  renderSummary(false, createInitialState());

  if (attendanceTable) {
    attendanceTable.replaceChildren();
  }

  if (emptyFeed) {
    emptyFeed.classList.remove("is-hidden");
  }
}

async function runStudentPipeline(student, runId, waitForNextStudent = true) {
  setCurrentStudent(student);
  setPhase("scanning");
  await pause(1000);
  if (runId !== simulationRun) return false;

  setPhase("detected");
  await pause(800);
  if (runId !== simulationRun) return false;

  setPhase("liveness");
  await pause(1000);
  if (runId !== simulationRun) return false;

  setPhase("verified");
  await pause(700);
  if (runId !== simulationRun) return false;

  setPhase("recognizing");
  await pause(1000);
  if (runId !== simulationRun) return false;

  setPhase("matched");
  await pause(700);
  if (runId !== simulationRun) return false;

  setPhase("recorded");
  recordAttendance(student);
  if (waitForNextStudent) {
    await pause(2300);
  }

  return runId === simulationRun;
}

async function startAttendanceSimulation() {
  const runId = ++simulationRun;

  while (runId === simulationRun) {
    resetDemo();

    for (const [index, student] of studentPool.entries()) {
      const completed = await runStudentPipeline(student, runId, index < studentPool.length - 1);
      if (!completed) {
        return;
      }
    }

    setPhase("resetting");
    await pause(2600);
    if (runId !== simulationRun) {
      return;
    }

    resetDemo();
    setCurrentStudent(studentPool[0], false);
    setPhase("scanning");
    await pause(650);
  }
}

function cycleTyping() {
  if (!typingText) {
    return;
  }

  let sequenceIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = typeSequence[sequenceIndex];

    if (deleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typingText.textContent = current.slice(0, charIndex);

    if (!deleting && charIndex === current.length) {
      deleting = true;
      window.setTimeout(tick, 1450);
      return;
    }

    if (deleting && charIndex === 0) {
      deleting = false;
      sequenceIndex = (sequenceIndex + 1) % typeSequence.length;
    }

    window.setTimeout(tick, deleting ? 40 : 58);
  };

  tick();
}

function observeSections() {
  const sections = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initialize() {
  updateClocks();
  cycleTyping();
  observeSections();
  resetDemo();
  setCurrentStudent(studentPool[0], false);
  setPhase("scanning");
  startAttendanceSimulation();

  window.setInterval(updateClocks, 1000);
}

initialize();
