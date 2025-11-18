import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import gradeApi from "@/api/gradeApi";
import StatusTabs from "./components/StatusTabs";
import GradeDetailModal from "./components/GradeDetailModal";
import RejectModal from "./components/RejectModal";
import GradeTable from "./components/GradeTable";
import FilterSection from "./components/FilterSection";

export default function GradesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Tất cả");
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Load submissions
  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const response = await gradeApi.getSubmissions();
      setSubmissions(response.data || []);
    } catch (error) {
      console.error("Error loading submissions:", error);
      toast.error("Không thể tải danh sách nộp điểm");
    } finally {
      setLoading(false);
    }
  };

  const data = useMemo(() => {
    return submissions.filter((g) => {
      const q = query.toLowerCase();
      const matchQuery = q
        ? g.class_id?.course_id?.code?.toLowerCase().includes(q) ||
          g.class_id?.course_id?.title?.toLowerCase().includes(q) ||
          g.teacher_id?.full_name?.toLowerCase().includes(q)
        : true;
      
      // Convert Vietnamese status to backend enum for filtering
      const getStatusEnum = (vietnameseStatus) => {
        switch(vietnameseStatus) {
          case "Chờ duyệt": return "pending_approval";
          case "Đã duyệt": return "approved";
          case "Đã trả lại": return "rejected";
          case "Nháp": return "draft";
          default: return vietnameseStatus;
        }
      };
      
      const statusEnum = getStatusEnum(status);
      const tabEnum = getStatusEnum(activeTab);
      
      const matchStatus = status === "Tất cả" ? true : g.status === statusEnum;
      const matchTab = activeTab === "Tất cả" ? true : g.status === tabEnum;
      return matchQuery && matchStatus && matchTab;
    });
  }, [submissions, query, status, activeTab]);

  const getStatusClass = (st) => {
    switch (st) {
      case "pending_approval":
        return "bg-amber-50 text-amber-700 ring-amber-600/20";
      case "approved":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      case "rejected":
        return "bg-rose-50 text-rose-700 ring-rose-600/20";
      case "draft":
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
  };

  const getStatusText = (st) => {
    switch (st) {
      case "pending_approval":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Đã trả lại";
      case "draft":
        return "Nháp";
      default:
        return st;
    }
  };

  // Định nghĩa các thẻ trạng thái với số lượng và phụ đề tương ứng
  const statusTabs = [
    {
      title: "Tất cả",
      count: submissions.length,
      subtitle: "Tất cả bản ghi",
      color: "blue",
    },
    {
      title: "Chờ duyệt",
      count: submissions.filter((s) => s.status === "pending_approval").length,
      subtitle: "Chờ phê duyệt",
      color: "amber",
    },
    {
      title: "Đã duyệt",
      count: submissions.filter((s) => s.status === "approved").length,
      subtitle: "Đã phê duyệt",
      color: "emerald",
    },
    {
      title: "Đã trả lại",
      count: submissions.filter((s) => s.status === "rejected").length,
      subtitle: "Yêu cầu chỉnh sửa",
      color: "rose",
    },
  ];

  const handleApprove = async (submissionId) => {
    try {
      await gradeApi.approveSubmission(submissionId, {
        approved_by: "current_user_id" // Should get from auth context
      });
      toast.success("Đã duyệt điểm thành công");
      loadSubmissions();
    } catch (error) {
      toast.error("Không thể duyệt điểm");
      console.error("Error approving submission:", error);
    }
  };

  const handleReject = async (submissionId) => {
    if (!rejectionReason.trim()) {
      toast.error("Vui lòng nhập lý do trả lại");
      return;
    }

    try {
      await gradeApi.rejectSubmission(submissionId, {
        rejected_by: "current_user_id", // Should get from auth context
        rejection_reason: rejectionReason
      });
      toast.success("Đã trả lại điểm");
      setShowRejectModal(false);
      setRejectionReason("");
      loadSubmissions();
    } catch (error) {
      toast.error("Không thể trả lại điểm");
      console.error("Error rejecting submission:", error);
    }
  };

  const handleViewDetail = (submission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Danh sách điểm
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý và phê duyệt điểm sinh viên theo học phần
            </p>
          </div>
          <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nhập điểm
          </button>
        </div>

        {/* Thẻ trạng thái */}
        <StatusTabs
          statusTabs={statusTabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />

        {/* Bộ lọc */}
        <FilterSection
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
        />

        {/* Bảng dữ liệu */}
        <GradeTable
          data={data}
          loading={loading}
          onApprove={handleApprove}
          onViewDetail={handleViewDetail}
          onRejectClick={(submission) => {
            setSelectedSubmission(submission);
            setShowRejectModal(true);
          }}
          getStatusClass={getStatusClass}
          getStatusText={getStatusText}
          formatDate={formatDate}
        />

        {/* Modal xem chi tiết */}
        <GradeDetailModal
          show={showDetailModal}
          submission={selectedSubmission}
          onClose={() => setShowDetailModal(false)}
          onApprove={handleApprove}
          onReject={() => {
            setShowDetailModal(false);
            setShowRejectModal(true);
          }}
          getStatusClass={getStatusClass}
          getStatusText={getStatusText}
          formatDate={formatDate}
        />

        {/* Modal trả lại điểm */}
        <RejectModal
          show={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setRejectionReason("");
            setSelectedSubmission(null);
          }}
          onSubmit={() => handleReject(selectedSubmission._id)}
          rejectionReason={rejectionReason}
          onReasonChange={setRejectionReason}
        />
      </div>
    </div>
  );
}
