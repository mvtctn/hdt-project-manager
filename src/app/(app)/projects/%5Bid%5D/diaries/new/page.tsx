"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProjectById, saveDiary, ConstructionDiary, Project } from "@/lib/mockData";
import Link from "next/link";

export default function NewDiary() {
  const { user, profile, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  
  // Form fields
  const [reportDate, setReportDate] = useState("");
  const [weatherTemp, setWeatherTemp] = useState("28 - 34");
  const [weatherStatus, setWeatherStatus] = useState("Nắng ráo, hanh khô");
  const [manpower, setManpower] = useState("Kỹ sư Hydrotech: 1 giám sát\nTổ điện nước: 5 công nhân\nTổ cơ điện phụ: 3 người");
  const [machinery, setMachinery] = useState("Máy hàn điện tử: 2 chiếc\nMáy khoan bê tông: 3 chiếc\nDụng cụ cầm tay đồng bộ");
  const [workDesc, setWorkDesc] = useState("");
  const [inspections, setInspections] = useState("");
  const [safety, setSafety] = useState("An toàn lao động đảm bảo 100%, trang bị đầy đủ BHLĐ.");
  
  // Photo states
  const [photos, setPhotos] = useState<{ url: string; caption: string }[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice recognition states
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && projectId) {
      const proj = getProjectById(projectId);
      if (proj) {
        setProject(proj);
      } else {
        router.push("/projects");
      }
    }
    // Đặt ngày mặc định là hôm nay
    setReportDate(new Date().toISOString().split("T")[0]);
  }, [user, projectId, router]);

  // Khởi tạo Web Speech API cho Voice-to-Text
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "vi-VN"; // Nhận diện tiếng Việt chuẩn xác

        rec.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            setWorkDesc((prev) => prev + (prev ? " " : "") + finalTranscript);
          }
        };

        rec.onerror = (e: any) => {
          console.error("Speech recognition error:", e);
          setIsRecording(false);
        };

        rec.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Bật/tắt ghi âm
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Trình duyệt của bạn không hỗ trợ bộ nhận diện giọng nói Web Speech. Hãy thử trên Chrome hoặc Safari mới nhất.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Nén ảnh chất lượng cao sử dụng HTML5 Canvas
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 800; // Chiều rộng/cao tối đa để tối ưu băng thông
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Nén với chất lượng 0.7 (giảm 85% dung lượng nhưng giữ nguyên độ nét)
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };
      };
    });
  };

  // Xử lý đính kèm ảnh
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    const newPhotosList = [...photos];

    for (let i = 0; i < files.length; i++) {
      const compressedDataUrl = await compressImage(files[i]);
      newPhotosList.push({
        url: compressedDataUrl,
        caption: `Hạng mục lắp đặt hiện trường ảnh ${newPhotosList.length + 1}`,
      });
    }

    setPhotos(newPhotosList);
    setIsCompressing(false);
  };

  const handleUpdateCaption = (index: number, newCaption: string) => {
    const updated = [...photos];
    updated[index].caption = newCaption;
    setPhotos(updated);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, idx) => idx !== index));
  };

  // Lưu nhật ký thi công
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workDesc.trim()) {
      alert("Vui lòng điền nội dung công việc chi tiết đã thi công!");
      return;
    }

    const newDiaryObj: ConstructionDiary = {
      id: "diary-" + Date.now(),
      project_id: projectId,
      report_date: reportDate,
      engineer_name: profile?.full_name || "Phạm Quốc Việt",
      weather_temp: weatherTemp,
      weather_status: weatherStatus,
      manpower_details: manpower,
      machinery_details: machinery,
      work_descriptions: workDesc,
      inspections: inspections,
      safety_issues: safety,
      photos: photos,
    };

    saveDiary(newDiaryObj);
    router.push(`/projects/${projectId}?tab=diaries`);
  };

  if (loading || !user || !project) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#090e1a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Đang tải biểu mẫu nhật ký...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#050811] min-h-screen text-slate-100 relative">
      <div className="radial-glow" style={{ top: "10%", right: "10%", opacity: 0.3 }}></div>


      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6 relative z-10">
        
        {/* Tiêu đề */}
        <div className="space-y-1">
          <Link href={`/projects/${projectId}?tab=diaries`} className="text-xs font-bold text-sky-400 hover:underline">
            &larr; Quay lại Nhật ký dự án
          </Link>
          <h2 className="text-xl sm:text-2xl font-black text-white pt-1 uppercase">
            Ghi Nhật ký thi công mới
          </h2>
          <p className="text-xs text-slate-400 leading-snug">
            {project.name} | Định dạng chuẩn Bộ Xây Dựng (Nghị định 06/2021/NĐ-CP).
          </p>
        </div>

        {/* Biểu mẫu */}
        <form onSubmit={handleSubmit} className="glass-panel p-6 bg-slate-900/10 border-slate-800 space-y-6 text-xs sm:text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Ngày báo cáo</label>
              <input
                type="date"
                required
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white font-semibold focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Nhiệt độ (oC)</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: 28 - 34"
                value={weatherTemp}
                onChange={(e) => setWeatherTemp(e.target.value)}
                className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Thời tiết chung</label>
              <input
                type="text"
                required
                placeholder="Nắng ráo, có mưa dông..."
                value={weatherStatus}
                onChange={(e) => setWeatherStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Lực lượng thi công (Nhân sự)</label>
              <textarea
                rows={3}
                required
                placeholder="Kỹ sư: ... người\nCông nhân: ... người (tổ đội cụ thể)"
                value={manpower}
                onChange={(e) => setManpower(e.target.value)}
                className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Thiết bị hoạt động tại hiện trường</label>
              <textarea
                rows={3}
                required
                placeholder="Tên máy móc thi công, số lượng, tình trạng..."
                value={machinery}
                onChange={(e) => setMachinery(e.target.value)}
                className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Nội dung công việc chi tiết + Ghi âm giọng nói */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold text-slate-400 uppercase">
                Mô tả chi tiết Công việc thi công trong ngày
              </label>
              
              {/* Nút Micro Ghi âm giọng nói (Speech-to-Text) */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isRecording
                    ? "bg-red-500/20 text-red-400 border border-red-500/30 record-pulse"
                    : "bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20"
                }`}
              >
                {isRecording ? "🔴 Đang nghe giọng nói..." : "🎤 Báo cáo bằng Giọng nói (Micro)"}
              </button>
            </div>
            <textarea
              rows={5}
              required
              placeholder="Mô tả cụ thể hôm nay lắp đặt thiết bị nào, hàn đường ống vị trí nào, khối lượng bao nhiêu... (Bạn có thể nhấp nút micro ở góc phải để nói báo cáo tiếng Việt tự động)"
              value={workDesc}
              onChange={(e) => setWorkDesc(e.target.value)}
              className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Công tác nghiệm thu kỹ thuật (Nếu có)</label>
            <textarea
              rows={2}
              placeholder="Hôm nay có nghiệm thu vật liệu đầu vào hoặc nghiệm thu hạng mục nào không..."
              value={inspections}
              onChange={(e) => setInspections(e.target.value)}
              className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Công tác an toàn & Sự cố phát sinh</label>
            <textarea
              rows={2}
              placeholder="Tình hình an toàn vệ sinh lao động công trường..."
              value={safety}
              onChange={(e) => setSafety(e.target.value)}
              className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          {/* CHỤP ẢNH & ĐÍNH KÈM HIỆN TRƯỜNG */}
          <div className="space-y-4 pt-4 border-t border-slate-800/60">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold text-slate-400 uppercase">
                Hình ảnh thi công đính kèm ({photos.length})
              </label>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/30 text-teal-400 text-xs font-bold rounded-lg transition-all"
              >
                📸 Chụp ảnh / Tải hình lên
              </button>
              
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                capture="environment" // Bật camera sau trực tiếp khi dùng trên điện thoại di động!
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {isCompressing && (
              <div className="text-xs text-sky-400 font-bold animate-pulse text-center">
                🔄 Đang xử lý và tự động nén dung lượng hình ảnh hiện trường...
              </div>
            )}

            {photos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {photos.map((ph, idx) => (
                  <div key={idx} className="bg-[#0b101c] p-3 border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ph.url}
                        alt="Đính kèm"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/75 hover:bg-black/90 flex items-center justify-center text-white text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    <input
                      type="text"
                      value={ph.caption}
                      onChange={(e) => handleUpdateCaption(idx, e.target.value)}
                      placeholder="Nhập chú thích hình ảnh..."
                      className="w-full px-2 py-1.5 bg-[#060a14] border border-slate-850 rounded text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nút Lưu và Hủy */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-800/60">
            <Link
              href={`/projects/${projectId}?tab=diaries`}
              className="btn-secondary px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center"
            >
              Hủy bỏ
            </Link>
            <button
              type="submit"
              className="btn-primary px-6 py-3 rounded-xl text-xs sm:text-sm"
            >
              💾 Lưu Nhật ký
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}
