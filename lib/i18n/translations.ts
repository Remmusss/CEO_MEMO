// Translation files for multi-language support

export type Language = "en" | "ja" | "vi"

export type Translations = {
  common: {
    dashboard: string
    employees: string
    payroll: string
    departments: string
    reports: string
    notifications: string
    profile: string
    settings: string
    logout: string
    login: string
    save: string
    cancel: string
    edit: string
    delete: string
    add: string
    search: string
    actions: string
    view: string
    status: string
    active: string
    inactive: string
    onLeave: string
    new: string
    configure: string
  }
  auth: {
    loginTitle: string
    loginDescription: string
    username: string
    password: string
    role: string
    selectRole: string
    admin: string
    hrManager: string
    payrollManager: string
    employee: string
    loginButton: string
    loginSuccess: string
    loginFailed: string
  }
  dashboard: {
    title: string
    totalEmployees: string
    departments: string
    payrollTotal: string
    notificationsCount: string
    overview: string
    analytics: string
    reports: string
    monthlyPayroll: string
    departmentDistribution: string
    attendanceOverview: string
    recentActivities: string
  }
  employees: {
    title: string
    addEmployee: string
    manageEmployees: string
    id: string
    name: string
    email: string
    department: string
    jobTitle: string
    status: string
    joinDate: string
    viewDetails: string
    editEmployee: string
    managePayroll: string
    deleteEmployee: string
  }
  payroll: {
    title: string
    generatePayslips: string
    exportPayroll: string
    payrollData: string
    payrollDescription: string
    employeeId: string
    employee: string
    baseSalary: string
    bonus: string
    deductions: string
    netSalary: string
    status: string
    processed: string
    onHold: string
    viewDetails: string
    editPayroll: string
    generatePayslip: string
    sendNotification: string
  }
  departments: {
    title: string
    addDepartment: string
    addJobTitle: string
    organizationStructure: string
    departmentsTab: string
    jobTitlesTab: string
    id: string
    departmentName: string
    manager: string
    employees: string
    location: string
    budget: string
    jobTitle: string
    department: string
    viewDetails: string
    editDepartment: string
    assignManager: string
    deleteDepartment: string
    editJobTitle: string
    deleteJobTitle: string
  }
  notifications: {
    title: string
    markAllRead: string
    configureAlerts: string
    systemNotifications: string
    notificationsDescription: string
    all: string
    anniversary: string
    leave: string
    payroll: string
    system: string
    noNotifications: string
    markAsRead: string
    notificationSettings: string
    configurePreferences: string
    workAnniversary: string
    sendAnniversary: string
    leavePolicy: string
    sendLeave: string
    payrollNotifications: string
    sendPayroll: string
    emailNotifications: string
    configureEmail: string
    additionalDetails: string
  }
  profile: {
    title: string
    employeeInformation: string
    personalTab: string
    employmentTab: string
    payrollTab: string
    attendanceTab: string
    fullName: string
    email: string
    phone: string
    address: string
    emergencyContact: string
    employeeId: string
    department: string
    jobTitle: string
    joinDate: string
    status: string
    manager: string
    baseSalary: string
    bonus: string
    deductions: string
    netSalary: string
    presentDays: string
    absentDays: string
    leaveDays: string
    workingDays: string
    viewSalaryHistory: string
    viewAttendanceHistory: string
    editProfile: string
  }
  settings: {
    title: string
    generalTab: string
    usersTab: string
    securityTab: string
    notificationsTab: string
    databaseTab: string
    integrationsTab: string
    generalSettings: string
    generalDescription: string
    companyName: string
    systemEmail: string
    timezone: string
    dateFormat: string
    maintenanceMode: string
    userManagement: string
    userDescription: string
    securitySettings: string
    securityDescription: string
    twoFactor: string
    passwordPolicy: string
    sessionTimeout: string
    maxLoginAttempts: string
    notificationSettings: string
    notificationDescription: string
    emailNotifications: string
    databaseSettings: string
    databaseDescription: string
    systemIntegrations: string
    integrationsDescription: string
  }
  language: {
    languageSelector: string
    english: string
    japanese: string
    vietnamese: string
  }
  reports: {
    title: string
    generateReport: string
    exportData: string
    totalEmployees: string
    averageSalary: string
    totalPayroll: string
    attendanceRate: string
    reportControls: string
    configureReports: string
    reportType: string
    hrReports: string
    payrollReports: string
    stockReports: string
    timeRange: string
    lastMonth: string
    last3Months: string
    last6Months: string
    lastYear: string
    charts: string
    tables: string
    tabularData: string
    departmentDistribution: string
    salaryDistribution: string
    monthlyPayroll: string
    payrollDistribution: string
    attendanceOverview: string
    attendanceStatistics: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      dashboard: "Dashboard",
      employees: "Employees",
      payroll: "Payroll",
      departments: "Departments",
      reports: "Reports",
      notifications: "Notifications",
      profile: "My Profile",
      settings: "Settings",
      logout: "Logout",
      login: "Login",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      add: "Add",
      search: "Search",
      actions: "Actions",
      view: "View",
      status: "Status",
      active: "Active",
      inactive: "Inactive",
      onLeave: "On Leave",
      new: "New",
      configure: "Configure",
    },
    auth: {
      loginTitle: "Login",
      loginDescription: "Enter your credentials to access the system",
      username: "Username",
      password: "Password",
      role: "Role",
      selectRole: "Select your role",
      admin: "Admin",
      hrManager: "HR Manager",
      payrollManager: "Payroll Manager",
      employee: "Employee",
      loginButton: "Login",
      loginSuccess: "Login successful",
      loginFailed: "Login failed",
    },
    dashboard: {
      title: "Dashboard",
      totalEmployees: "Total Employees",
      departments: "Departments",
      payrollTotal: "Payroll Total",
      notificationsCount: "Notifications",
      overview: "Overview",
      analytics: "Analytics",
      reports: "Reports",
      monthlyPayroll: "Monthly Payroll Overview",
      departmentDistribution: "Department Distribution",
      attendanceOverview: "Attendance Overview",
      recentActivities: "Recent Activities",
    },
    employees: {
      title: "Employee Management",
      addEmployee: "Add Employee",
      manageEmployees: "Manage your employees, search, and view details.",
      id: "ID",
      name: "Name",
      email: "Email",
      department: "Department",
      jobTitle: "Job Title",
      status: "Status",
      joinDate: "Join Date",
      viewDetails: "View Details",
      editEmployee: "Edit Employee",
      managePayroll: "Manage Payroll",
      deleteEmployee: "Delete Employee",
    },
    payroll: {
      title: "Payroll Management",
      generatePayslips: "Generate Payslips",
      exportPayroll: "Export Payroll",
      payrollData: "Payroll Data",
      payrollDescription: "Manage employee payroll, process payments, and generate reports.",
      employeeId: "Employee ID",
      employee: "Employee",
      baseSalary: "Base Salary",
      bonus: "Bonus",
      deductions: "Deductions",
      netSalary: "Net Salary",
      status: "Status",
      processed: "Processed",
      onHold: "On Hold",
      viewDetails: "View Details",
      editPayroll: "Edit Payroll",
      generatePayslip: "Generate Payslip",
      sendNotification: "Send Email Notification",
    },
    departments: {
      title: "Department & Job Title Management",
      addDepartment: "Add Department",
      addJobTitle: "Add Job Title",
      organizationStructure: "Organization Structure",
      departmentsTab: "Departments",
      jobTitlesTab: "Job Titles",
      id: "ID",
      departmentName: "Department Name",
      manager: "Manager",
      employees: "Employees",
      location: "Location",
      budget: "Budget",
      jobTitle: "Job Title",
      department: "Department",
      viewDetails: "View Details",
      editDepartment: "Edit Department",
      assignManager: "Assign Manager",
      deleteDepartment: "Delete Department",
      editJobTitle: "Edit Job Title",
      deleteJobTitle: "Delete Job Title",
    },
    notifications: {
      title: "Notifications",
      markAllRead: "Mark All as Read",
      configureAlerts: "Configure Alerts",
      systemNotifications: "System Notifications",
      notificationsDescription: "Stay updated with important alerts and notifications",
      all: "All",
      anniversary: "Anniversary",
      leave: "Leave",
      payroll: "Payroll",
      system: "System",
      noNotifications: "No notifications in this category",
      markAsRead: "Mark as read",
      notificationSettings: "Notification Settings",
      configurePreferences: "Configure system-wide notification preferences",
      workAnniversary: "Work Anniversary Notifications",
      sendAnniversary: "Send notifications for employee work anniversaries",
      leavePolicy: "Leave Policy Alerts",
      sendLeave: "Send alerts when employees violate leave policies",
      payrollNotifications: "Payroll Notifications",
      sendPayroll: "Send notifications about payroll processing and errors",
      emailNotifications: "Email Notifications",
      configureEmail: "Configure email delivery for system notifications",
      additionalDetails: "Additional Details",
    },
    profile: {
      title: "My Profile",
      employeeInformation: "Employee Information",
      personalTab: "Personal",
      employmentTab: "Employment",
      payrollTab: "Payroll",
      attendanceTab: "Attendance",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      emergencyContact: "Emergency Contact",
      employeeId: "Employee ID",
      department: "Department",
      jobTitle: "Job Title",
      joinDate: "Join Date",
      status: "Status",
      manager: "Manager",
      baseSalary: "Base Salary",
      bonus: "Bonus",
      deductions: "Deductions",
      netSalary: "Net Salary",
      presentDays: "Present Days",
      absentDays: "Absent Days",
      leaveDays: "Leave Days",
      workingDays: "Working Days",
      viewSalaryHistory: "View Salary History",
      viewAttendanceHistory: "View Attendance History",
      editProfile: "Edit Profile",
    },
    settings: {
      title: "System Settings",
      generalTab: "General",
      usersTab: "Users",
      securityTab: "Security",
      notificationsTab: "Notifications",
      databaseTab: "Database",
      integrationsTab: "Integrations",
      generalSettings: "General Settings",
      generalDescription: "Manage system-wide settings and configurations",
      companyName: "Company Name",
      systemEmail: "System Email",
      timezone: "Timezone",
      dateFormat: "Date Format",
      maintenanceMode: "Maintenance Mode",
      userManagement: "User Management",
      userDescription: "Manage user accounts and role assignments",
      securitySettings: "Security Settings",
      securityDescription: "Configure system security and access controls",
      twoFactor: "Two-Factor Authentication",
      passwordPolicy: "Password Policy",
      sessionTimeout: "Session Timeout (minutes)",
      maxLoginAttempts: "Max Login Attempts",
      notificationSettings: "Notification Settings",
      notificationDescription: "Configure system-wide notification preferences",
      emailNotifications: "Email Notifications",
      databaseSettings: "Database Settings",
      databaseDescription: "Manage database connections and backups",
      systemIntegrations: "System Integrations",
      integrationsDescription: "Manage connections with external systems",
    },
    language: {
      languageSelector: "Language",
      english: "English",
      japanese: "Japanese",
      vietnamese: "Vietnamese",
    },
    reports: {
      title: "Reports & Analytics",
      generateReport: "Generate Report",
      exportData: "Export Data",
      totalEmployees: "Total Employees",
      averageSalary: "Average Salary",
      totalPayroll: "Total Payroll",
      attendanceRate: "Attendance Rate",
      reportControls: "Report Controls",
      configureReports: "Configure and generate reports",
      reportType: "Report Type",
      hrReports: "HR Reports",
      payrollReports: "Payroll Reports",
      stockReports: "Stock Dividend Reports",
      timeRange: "Time Range",
      lastMonth: "Last Month",
      last3Months: "Last 3 Months",
      last6Months: "Last 6 Months",
      lastYear: "Last Year",
      charts: "Charts",
      tables: "Tables",
      tabularData: "Tabular data will be displayed here based on the selected report type and time range.",
      departmentDistribution: "Department Distribution",
      salaryDistribution: "Salary distribution by department",
      monthlyPayroll: "Monthly Payroll Trend",
      payrollDistribution: "Total payroll distribution for the last 6 months",
      attendanceOverview: "Attendance Overview",
      attendanceStatistics: "Current month attendance statistics",
    },
  },
  ja: {
    common: {
      dashboard: "ダッシュボード",
      employees: "従業員",
      payroll: "給与",
      departments: "部署",
      reports: "レポート",
      notifications: "通知",
      profile: "マイプロフィール",
      settings: "設定",
      logout: "ログアウト",
      login: "ログイン",
      save: "保存",
      cancel: "キャンセル",
      edit: "編集",
      delete: "削除",
      add: "追加",
      search: "検索",
      actions: "アクション",
      view: "表示",
      status: "ステータス",
      active: "アクティブ",
      inactive: "非アクティブ",
      onLeave: "休暇中",
      new: "新規",
      configure: "設定",
    },
    auth: {
      loginTitle: "ログイン",
      loginDescription: "システムにアクセスするには認証情報を入力してください",
      username: "ユーザー名",
      password: "パスワード",
      role: "役割",
      selectRole: "役割を選択してください",
      admin: "管理者",
      hrManager: "人事マネージャー",
      payrollManager: "給与マネージャー",
      employee: "従業員",
      loginButton: "ログイン",
      loginSuccess: "ログイン成功",
      loginFailed: "ログイン失敗",
    },
    dashboard: {
      title: "ダッシュボード",
      totalEmployees: "従業員総数",
      departments: "部署",
      payrollTotal: "給与総額",
      notificationsCount: "通知",
      overview: "概要",
      analytics: "分析",
      reports: "レポート",
      monthlyPayroll: "月次給与概要",
      departmentDistribution: "部署分布",
      attendanceOverview: "出勤概要",
      recentActivities: "最近のアクティビティ",
    },
    employees: {
      title: "従業員管理",
      addEmployee: "従業員を追加",
      manageEmployees: "従業員の管理、検索、詳細の表示を行います。",
      id: "ID",
      name: "名前",
      email: "メール",
      department: "部署",
      jobTitle: "役職",
      status: "ステータス",
      joinDate: "入社日",
      viewDetails: "詳細を表示",
      editEmployee: "従業員を編集",
      managePayroll: "給与を管理",
      deleteEmployee: "従業員を削除",
    },
    payroll: {
      title: "給与管理",
      generatePayslips: "給与明細を生成",
      exportPayroll: "給与をエクスポート",
      payrollData: "給与データ",
      payrollDescription: "従業員の給与を管理し、支払いを処理し、レポートを生成します。",
      employeeId: "従業員ID",
      employee: "従業員",
      baseSalary: "基本給",
      bonus: "ボーナス",
      deductions: "控除",
      netSalary: "手取り給与",
      status: "ステータス",
      processed: "処理済み",
      onHold: "保留中",
      viewDetails: "詳細を表示",
      editPayroll: "給与を編集",
      generatePayslip: "給与明細を生成",
      sendNotification: "メール通知を送信",
    },
    departments: {
      title: "部署・役職管理",
      addDepartment: "部署を追加",
      addJobTitle: "役職を追加",
      organizationStructure: "組織構造",
      departmentsTab: "部署",
      jobTitlesTab: "役職",
      id: "ID",
      departmentName: "部署名",
      manager: "マネージャー",
      employees: "従業員",
      location: "場所",
      budget: "予算",
      jobTitle: "役職",
      department: "部署",
      viewDetails: "詳細を表示",
      editDepartment: "部署を編集",
      assignManager: "マネージャーを割り当て",
      deleteDepartment: "部署を削除",
      editJobTitle: "役職を編集",
      deleteJobTitle: "役職を削除",
    },
    notifications: {
      title: "通知",
      markAllRead: "すべて既読にする",
      configureAlerts: "アラートを設定",
      systemNotifications: "システム通知",
      notificationsDescription: "重要なアラートと通知を常に確認できます",
      all: "すべて",
      anniversary: "記念日",
      leave: "休暇",
      payroll: "給与",
      system: "システム",
      noNotifications: "このカテゴリに通知はありません",
      markAsRead: "既読にする",
      notificationSettings: "通知設定",
      configurePreferences: "システム全体の通知設定を構成します",
      workAnniversary: "勤続記念日の通知",
      sendAnniversary: "従業員の勤続記念日の通知を送信",
      leavePolicy: "休暇ポリシーアラート",
      sendLeave: "従業員が休暇ポリシーに違反した場合にアラートを送信",
      payrollNotifications: "給与通知",
      sendPayroll: "給与処理とエラーに関する通知を送信",
      emailNotifications: "メール通知",
      configureEmail: "システム通知のメール配信を設定",
      additionalDetails: "追加詳細",
    },
    profile: {
      title: "マイプロフィール",
      employeeInformation: "従業員情報",
      personalTab: "個人",
      employmentTab: "雇用",
      payrollTab: "給与",
      attendanceTab: "出勤",
      fullName: "氏名",
      email: "メール",
      phone: "電話",
      address: "住所",
      emergencyContact: "緊急連絡先",
      employeeId: "従業員ID",
      department: "部署",
      jobTitle: "役職",
      joinDate: "入社日",
      status: "ステータス",
      manager: "マネージャー",
      baseSalary: "基本給",
      bonus: "ボーナス",
      deductions: "控除",
      netSalary: "手取り給与",
      presentDays: "出勤日数",
      absentDays: "欠勤日数",
      leaveDays: "休暇日数",
      workingDays: "勤務日数",
      viewSalaryHistory: "給与履歴を表示",
      viewAttendanceHistory: "出勤履歴を表示",
      editProfile: "プロフィールを編集",
    },
    settings: {
      title: "システム設定",
      generalTab: "一般",
      usersTab: "ユーザー",
      securityTab: "セキュリティ",
      notificationsTab: "通知",
      databaseTab: "データベース",
      integrationsTab: "連携",
      generalSettings: "一般設定",
      generalDescription: "システム全体の設定と構成を管理します",
      companyName: "会社名",
      systemEmail: "システムメール",
      timezone: "タイムゾーン",
      dateFormat: "日付形式",
      maintenanceMode: "メンテナンスモード",
      userManagement: "ユーザー管理",
      userDescription: "ユーザーアカウントと役割の割り当てを管理します",
      securitySettings: "セキュリティ設定",
      securityDescription: "システムのセキュリティとアクセス制御を構成します",
      twoFactor: "二要素認証",
      passwordPolicy: "パスワードポリシー",
      sessionTimeout: "セッションタイムアウト（分）",
      maxLoginAttempts: "最大ログイン試行回数",
      notificationSettings: "通知設定",
      notificationDescription: "システム全体の通知設定を構成します",
      emailNotifications: "メール通知",
      databaseSettings: "データベース設定",
      databaseDescription: "データベース接続とバックアップを管理します",
      systemIntegrations: "システム連携",
      integrationsDescription: "外部システムとの接続を管理します",
    },
    language: {
      languageSelector: "言語",
      english: "英語",
      japanese: "日本語",
      vietnamese: "ベトナム語",
    },
    reports: {
      title: "レポート＆分析",
      generateReport: "レポート生成",
      exportData: "データのエクスポート",
      totalEmployees: "従業員総数",
      averageSalary: "平均給与",
      totalPayroll: "給与総額",
      attendanceRate: "出勤率",
      reportControls: "レポートコントロール",
      configureReports: "レポートの設定と生成",
      reportType: "レポートタイプ",
      hrReports: "人事レポート",
      payrollReports: "給与レポート",
      stockReports: "株式配当レポート",
      timeRange: "期間",
      lastMonth: "先月",
      last3Months: "過去3ヶ月",
      last6Months: "過去6ヶ月",
      lastYear: "過去1年",
      charts: "チャート",
      tables: "テーブル",
      tabularData: "選択したレポートタイプと期間に基づいて表形式のデータが表示されます。",
      departmentDistribution: "部署分布",
      salaryDistribution: "部署別給与分布",
      monthlyPayroll: "月次給与トレンド",
      payrollDistribution: "過去6ヶ月の給与総額分布",
      attendanceOverview: "出勤概要",
      attendanceStatistics: "今月の出勤統計",
    },
  },
  vi: {
    common: {
      dashboard: "Bảng điều khiển",
      employees: "Nhân viên",
      payroll: "Bảng lương",
      departments: "Phòng ban",
      reports: "Báo cáo",
      notifications: "Thông báo",
      profile: "Hồ sơ của tôi",
      settings: "Cài đặt",
      logout: "Đăng xuất",
      login: "Đăng nhập",
      save: "Lưu",
      cancel: "Hủy",
      edit: "Chỉnh sửa",
      delete: "Xóa",
      add: "Thêm",
      search: "Tìm kiếm",
      actions: "Hành động",
      view: "Xem",
      status: "Trạng thái",
      active: "Hoạt động",
      inactive: "Không hoạt động",
      onLeave: "Đang nghỉ phép",
      new: "Mới",
      configure: "Cấu hình",
    },
    auth: {
      loginTitle: "Đăng nhập",
      loginDescription: "Nhập thông tin đăng nhập để truy cập hệ thống",
      username: "Tên đăng nhập",
      password: "Mật khẩu",
      role: "Vai trò",
      selectRole: "Chọn vai trò của bạn",
      admin: "Quản trị viên",
      hrManager: "Quản lý nhân sự",
      payrollManager: "Quản lý lương",
      employee: "Nhân viên",
      loginButton: "Đăng nhập",
      loginSuccess: "Đăng nhập thành công",
      loginFailed: "Đăng nhập thất bại",
    },
    dashboard: {
      title: "Bảng điều khiển",
      totalEmployees: "Tổng số nhân viên",
      departments: "Phòng ban",
      payrollTotal: "Tổng lương",
      notificationsCount: "Thông báo",
      overview: "Tổng quan",
      analytics: "Phân tích",
      reports: "Báo cáo",
      monthlyPayroll: "Tổng quan lương hàng tháng",
      departmentDistribution: "Phân bố phòng ban",
      attendanceOverview: "Tổng quan điểm danh",
      recentActivities: "Hoạt động gần đây",
    },
    employees: {
      title: "Quản lý nhân viên",
      addEmployee: "Thêm nhân viên",
      manageEmployees: "Quản lý nhân viên, tìm kiếm và xem chi tiết.",
      id: "ID",
      name: "Tên",
      email: "Email",
      department: "Phòng ban",
      jobTitle: "Chức danh",
      status: "Trạng thái",
      joinDate: "Ngày vào làm",
      viewDetails: "Xem chi tiết",
      editEmployee: "Chỉnh sửa nhân viên",
      managePayroll: "Quản lý lương",
      deleteEmployee: "Xóa nhân viên",
    },
    payroll: {
      title: "Quản lý lương",
      generatePayslips: "Tạo phiếu lương",
      exportPayroll: "Xuất bảng lương",
      payrollData: "Dữ liệu lương",
      payrollDescription: "Quản lý lương nhân viên, xử lý thanh toán và tạo báo cáo.",
      employeeId: "ID nhân viên",
      employee: "Nhân viên",
      baseSalary: "Lương cơ bản",
      bonus: "Thưởng",
      deductions: "Khấu trừ",
      netSalary: "Lương thực lãnh",
      status: "Trạng thái",
      processed: "Đã xử lý",
      onHold: "Đang chờ",
      viewDetails: "Xem chi tiết",
      editPayroll: "Chỉnh sửa lương",
      generatePayslip: "Tạo phiếu lương",
      sendNotification: "Gửi thông báo email",
    },
    departments: {
      title: "Quản lý phòng ban & chức danh",
      addDepartment: "Thêm phòng ban",
      addJobTitle: "Thêm chức danh",
      organizationStructure: "Cơ cấu tổ chức",
      departmentsTab: "Phòng ban",
      jobTitlesTab: "Chức danh",
      id: "ID",
      departmentName: "Tên phòng ban",
      manager: "Quản lý",
      employees: "Nhân viên",
      location: "Địa điểm",
      budget: "Ngân sách",
      jobTitle: "Chức danh",
      department: "Phòng ban",
      viewDetails: "Xem chi tiết",
      editDepartment: "Chỉnh sửa phòng ban",
      assignManager: "Phân công quản lý",
      deleteDepartment: "Xóa phòng ban",
      editJobTitle: "Chỉnh sửa chức danh",
      deleteJobTitle: "Xóa chức danh",
    },
    notifications: {
      title: "Thông báo",
      markAllRead: "Đánh dấu tất cả đã đọc",
      configureAlerts: "Cấu hình cảnh báo",
      systemNotifications: "Thông báo hệ thống",
      notificationsDescription: "Cập nhật với các cảnh báo và thông báo quan trọng",
      all: "Tất cả",
      anniversary: "Kỷ niệm",
      leave: "Nghỉ phép",
      payroll: "Lương",
      system: "Hệ thống",
      noNotifications: "Không có thông báo trong danh mục này",
      markAsRead: "Đánh dấu đã đọc",
      notificationSettings: "Cài đặt thông báo",
      configurePreferences: "Cấu hình tùy chọn thông báo toàn hệ thống",
      workAnniversary: "Thông báo kỷ niệm công việc",
      sendAnniversary: "Gửi thông báo cho kỷ niệm công việc của nhân viên",
      leavePolicy: "Cảnh báo chính sách nghỉ phép",
      sendLeave: "Gửi cảnh báo khi nhân viên vi phạm chính sách nghỉ phép",
      payrollNotifications: "Thông báo lương",
      sendPayroll: "Gửi thông báo về xử lý lương và lỗi",
      emailNotifications: "Thông báo email",
      configureEmail: "Cấu hình gửi email cho thông báo hệ thống",
      additionalDetails: "Chi tiết bổ sung",
    },
    profile: {
      title: "Hồ sơ của tôi",
      employeeInformation: "Thông tin nhân viên",
      personalTab: "Cá nhân",
      employmentTab: "Công việc",
      payrollTab: "Lương",
      attendanceTab: "Điểm danh",
      fullName: "Họ và tên",
      email: "Email",
      phone: "Điện thoại",
      address: "Địa chỉ",
      emergencyContact: "Liên hệ khẩn cấp",
      employeeId: "ID nhân viên",
      department: "Phòng ban",
      jobTitle: "Chức danh",
      joinDate: "Ngày vào làm",
      status: "Trạng thái",
      manager: "Quản lý",
      baseSalary: "Lương cơ bản",
      bonus: "Thưởng",
      deductions: "Khấu trừ",
      netSalary: "Lương thực lãnh",
      presentDays: "Ngày có mặt",
      absentDays: "Ngày vắng mặt",
      leaveDays: "Ngày nghỉ phép",
      workingDays: "Ngày làm việc",
      viewSalaryHistory: "Xem lịch sử lương",
      viewAttendanceHistory: "Xem lịch sử điểm danh",
      editProfile: "Chỉnh sửa hồ sơ",
    },
    settings: {
      title: "Cài đặt hệ thống",
      generalTab: "Chung",
      usersTab: "Người dùng",
      securityTab: "Bảo mật",
      notificationsTab: "Thông báo",
      databaseTab: "Cơ sở dữ liệu",
      integrationsTab: "Tích hợp",
      generalSettings: "Cài đặt chung",
      generalDescription: "Quản lý cài đặt và cấu hình toàn hệ thống",
      companyName: "Tên công ty",
      systemEmail: "Email hệ thống",
      timezone: "Múi giờ",
      dateFormat: "Định dạng ngày",
      maintenanceMode: "Chế độ bảo trì",
      userManagement: "Quản lý người dùng",
      userDescription: "Quản lý tài khoản người dùng và phân quyền",
      securitySettings: "Cài đặt bảo mật",
      securityDescription: "Cấu hình bảo mật hệ thống và kiểm soát truy cập",
      twoFactor: "Xác thực hai yếu tố",
      passwordPolicy: "Chính sách mật khẩu",
      sessionTimeout: "Thời gian hết phiên (phút)",
      maxLoginAttempts: "Số lần đăng nhập tối đa",
      notificationSettings: "Cài đặt thông báo",
      notificationDescription: "Cấu hình tùy chọn thông báo toàn hệ thống",
      emailNotifications: "Thông báo email",
      databaseSettings: "Cài đặt cơ sở dữ liệu",
      databaseDescription: "Quản lý kết nối cơ sở dữ liệu và sao lưu",
      systemIntegrations: "Tích hợp hệ thống",
      integrationsDescription: "Quản lý kết nối với hệ thống bên ngoài",
    },
    language: {
      languageSelector: "Ngôn ngữ",
      english: "Tiếng Anh",
      japanese: "Tiếng Nhật",
      vietnamese: "Tiếng Việt",
    },
    reports: {
      title: "Báo cáo & Phân tích",
      generateReport: "Tạo báo cáo",
      exportData: "Xuất dữ liệu",
      totalEmployees: "Tổng số nhân viên",
      averageSalary: "Lương trung bình",
      totalPayroll: "Tổng lương",
      attendanceRate: "Tỷ lệ điểm danh",
      reportControls: "Điều khiển báo cáo",
      configureReports: "Cấu hình và tạo báo cáo",
      reportType: "Loại báo cáo",
      hrReports: "Báo cáo nhân sự",
      payrollReports: "Báo cáo lương",
      stockReports: "Báo cáo cổ tức",
      timeRange: "Khoảng thời gian",
      lastMonth: "Tháng trước",
      last3Months: "3 tháng trước",
      last6Months: "6 tháng trước",
      lastYear: "Năm trước",
      charts: "Biểu đồ",
      tables: "Bảng",
      tabularData: "Dữ liệu dạng bảng sẽ được hiển thị dựa trên loại báo cáo và khoảng thời gian đã chọn.",
      departmentDistribution: "Phân bố phòng ban",
      salaryDistribution: "Phân bố lương theo phòng ban",
      monthlyPayroll: "Xu hướng lương hàng tháng",
      payrollDistribution: "Phân bố tổng lương trong 6 tháng qua",
      attendanceOverview: "Tổng quan điểm danh",
      attendanceStatistics: "Thống kê điểm danh tháng hiện tại",
    },
  },
}
