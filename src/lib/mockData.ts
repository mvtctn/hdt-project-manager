export interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  client: string;
  start_date: string;
  end_date: string;
  status: "planning" | "ongoing" | "completed" | "suspended";
  description: string;
}

export interface Task {
  id: string;
  project_id: string;
  name: string;
  start_date: string;
  end_date: string;
  progress: number;
  dependencies: string[];
  assigned_to?: string;
  status: "pending" | "active" | "completed";
}

export interface ConstructionDiary {
  id: string;
  project_id: string;
  report_date: string;
  engineer_name: string;
  weather_temp: string;
  weather_status: string;
  manpower_details: string;
  machinery_details: string;
  work_descriptions: string;
  inspections: string;
  safety_issues: string;
  photos: { url: string; caption: string }[];
}

// Initial mock data
const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Lắp đặt Trạm bơm tăng áp & Cơ điện Hydrotech Đông Anh",
    code: "HT-2026-DA",
    location: "KCN Đông Anh, Hà Nội",
    client: "UBND Huyện Đông Anh",
    start_date: "2026-04-10",
    end_date: "2026-12-15",
    status: "ongoing",
    description: "Thi công lắp đặt toàn bộ hệ thống cơ điện (M&E), trạm biến áp 250kVA và hệ thống bơm tăng áp công suất lớn 500m3/h.",
  },
  {
    id: "proj-2",
    name: "Hệ thống xử lý nước thải Nhà máy dệt nhuộm Nhơn Trạch",
    code: "HT-2025-NT",
    location: "KCN Nhơn Trạch 3, Đồng Nai",
    client: "Công ty Cổ phần Dệt nhuộm Phong Phú",
    start_date: "2025-09-01",
    end_date: "2026-02-28",
    status: "completed",
    description: "Cung cấp thiết bị và lắp đặt hoàn thiện bể Aerotank, bể lắng ly tâm và tủ điện điều khiển PLC Scada tự động.",
  },
  {
    id: "proj-3",
    name: "Thi công Đường ống cấp nước sạch D200 Thủ Đức",
    code: "HT-2026-TD",
    location: "Phường Linh Trung, Thủ Đức, TP.HCM",
    client: "Công ty Cấp nước Thủ Đức (Sawaco)",
    start_date: "2026-06-01",
    end_date: "2026-10-30",
    status: "planning",
    description: "Đào đường, hạ ngầm tuyến ống truyền tải nước sạch HDPE D200 hàn nhiệt dọc tuyến đường Võ Văn Ngân.",
  },
];

const INITIAL_TASKS: Task[] = [
  // Tasks for Project 1
  {
    id: "task-1-1",
    project_id: "proj-1",
    name: "Khảo sát mặt bằng và định vị móng trạm bơm",
    start_date: "2026-04-10",
    end_date: "2026-04-20",
    progress: 100,
    dependencies: [],
    assigned_to: "Phạm Quốc Việt",
    status: "completed",
  },
  {
    id: "task-1-2",
    project_id: "proj-1",
    name: "Đổ bê tông móng trạm bơm và bệ máy",
    start_date: "2026-04-22",
    end_date: "2026-05-10",
    progress: 100,
    dependencies: ["task-1-1"],
    assigned_to: "Phạm Quốc Việt",
    status: "completed",
  },
  {
    id: "task-1-3",
    project_id: "proj-1",
    name: "Lắp đặt khung nhà che trạm bơm và ống công nghệ",
    start_date: "2026-05-12",
    end_date: "2026-06-05",
    progress: 65,
    dependencies: ["task-1-2"],
    assigned_to: "Phạm Quốc Việt",
    status: "active",
  },
  {
    id: "task-1-4",
    project_id: "proj-1",
    name: "Đấu nối tủ điện điều khiển, lắp máy bơm chính (3 tổ máy)",
    start_date: "2026-06-08",
    end_date: "2026-07-15",
    progress: 15,
    dependencies: ["task-1-3"],
    assigned_to: "Lê Thanh Sơn",
    status: "active",
  },
  {
    id: "task-1-5",
    project_id: "proj-1",
    name: "Kiểm tra cơ điện, chạy thử không tải và có tải nghiệm thu",
    start_date: "2026-07-18",
    end_date: "2026-08-10",
    progress: 0,
    dependencies: ["task-1-4"],
    assigned_to: "Lê Thanh Sơn",
    status: "pending",
  },
];

const INITIAL_DIARIES: ConstructionDiary[] = [
  {
    id: "diary-1-1",
    project_id: "proj-1",
    report_date: "2026-05-20",
    engineer_name: "Phạm Quốc Việt",
    weather_temp: "32°C - 36°C",
    weather_status: "Nắng nóng gay gắt buổi chiều, không mưa",
    manpower_details: "Kỹ sư giám sát: 1 người\nTổ cơ điện: 5 công nhân\nTổ lắp ống: 4 công nhân\nNhà thầu phụ hàn xì: 2 người",
    machinery_details: "Máy hàn Jasic: 3 chiếc\nXe cẩu tự hành 5 tấn: 1 chiếc (hoạt động 4 giờ)\nMáy cắt sắt cầm tay: 4 chiếc",
    work_descriptions: "Tiến hành định vị và lắp đặt mặt bích đai khởi thủy ống chính D300.\nCăn chỉnh bệ móng bơm số 1 và số 2.\nHàn đấu nối đường ống hút INOX 304 mặt bích đầu vào bể chứa.\nKỹ sư đã sử dụng micro ghi âm trực tiếp tại hiện trường để điền báo cáo nội dung công việc nhanh chóng.",
    inspections: "Nghiệm thu cốt thép móng nhà điều hành trạm bơm cùng đại diện giám sát kỹ thuật Sawaco.",
    safety_issues: "An toàn lao động đảm bảo 100%. Đã nhắc nhở tổ hàn đeo kính bảo hộ và găng tay chịu nhiệt. Bổ sung nước chanh giải nhiệt cho công nhân do nắng nóng.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80",
        caption: "Thi công lắp đặt cốt thép móng bệ bơm trạm áp lực",
      },
      {
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80",
        caption: "Căn chỉnh trục và định vị mặt bích bơm nước công nghiệp",
      }
    ],
  },
];

// LocalStorage helpers to simulate database operations offline/locally
export const getProjects = (): Project[] => {
  if (typeof window === "undefined") return INITIAL_PROJECTS;
  const stored = localStorage.getItem("ht_projects");
  if (!stored) {
    localStorage.setItem("ht_projects", JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  }
  return JSON.parse(stored);
};

export const getProjectById = (id: string): Project | undefined => {
  return getProjects().find((p) => p.id === id);
};

export const saveProject = (project: Project) => {
  const current = getProjects();
  const index = current.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    current[index] = project;
  } else {
    current.push(project);
  }
  localStorage.setItem("ht_projects", JSON.stringify(current));
};

export const getTasks = (projectId?: string): Task[] => {
  if (typeof window === "undefined") return INITIAL_TASKS;
  const stored = localStorage.getItem("ht_tasks");
  const allTasks = stored ? JSON.parse(stored) : INITIAL_TASKS;
  if (!stored) {
    localStorage.setItem("ht_tasks", JSON.stringify(INITIAL_TASKS));
  }
  if (projectId) {
    return allTasks.filter((t: Task) => t.project_id === projectId);
  }
  return allTasks;
};

export const saveTask = (task: Task) => {
  const current = getTasks();
  const index = current.findIndex((t) => t.id === task.id);
  if (index >= 0) {
    current[index] = task;
  } else {
    current.push(task);
  }
  localStorage.setItem("ht_tasks", JSON.stringify(current));
};

export const getDiaries = (projectId?: string): ConstructionDiary[] => {
  if (typeof window === "undefined") return INITIAL_DIARIES;
  const stored = localStorage.getItem("ht_diaries");
  const allDiaries = stored ? JSON.parse(stored) : INITIAL_DIARIES;
  if (!stored) {
    localStorage.setItem("ht_diaries", JSON.stringify(INITIAL_DIARIES));
  }
  if (projectId) {
    return allDiaries.filter((d: ConstructionDiary) => d.project_id === projectId);
  }
  return allDiaries;
};

export const getDiaryById = (id: string): ConstructionDiary | undefined => {
  return getDiaries().find((d) => d.id === id);
};

export const saveDiary = (diary: ConstructionDiary) => {
  const current = getDiaries();
  const index = current.findIndex((d) => d.id === diary.id);
  if (index >= 0) {
    current[index] = diary;
  } else {
    current.push(diary);
  }
  localStorage.setItem("ht_diaries", JSON.stringify(current));
};
