import { useState, useRef, useCallback } from "react";
import { api } from "../../api/api";
import UploadIcon from "../icons/UploadIcon";
import TrashIcon from "../icons/TrashIcon";
import CameraIcon from "../icons/CameraIcon";
import BrandIcon from "../icons/BrandIcon";

const fmtSize = (b) => 
    b < 1024 * 1024
    ? `${(b / 1024).toFixed(1)} KB`
    : `${(b / (1024 * 1024)).toFixed(1)} MB`;

export default function Dashboard({ user, onLogout}) {
    const [profileImg, setProfileImg] = useState(user.profileImg?.url || null);
    const [seledtedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [toast, setToast] = useState(null);
    const fileInputRef = useRef(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleFile = useCallback((file) => {
        if (!file) return;
        if (!file.type.startsWith("image/"))
            return showToast("Only image files are allowed.", "error");
        if (file.size > 2 * 1024 * 1024)
            return showToast("File size must be less than 2MB.", "error");
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(file);
    };

    const clearSelection = () => {
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };
    const handleUpload = async () => {
        if (!seledtedFile) return;
        setUploading(true);
        setProgress(20);
        try {
            setProgress(50);
            const result = await api.uploadPicture(user.idToken, seledtedFile);
            setProgress(100);
            await new Promise((r) => setTimeout(r, 500));
            if (result.profileImg?.url) {
                setProfileImg(result.profileImg.url);
            } else {
                setProfileImg(preview);
            }
            showToast("Profile picture updated successfully.");
            clearSelection();
        } catch (error) {
          showToast("Upload failed. Check your connection.", "error");  
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const handleDelete = async () => {
        if (!profileImg) return;
        setDeleting(true);
        try {
            await api.deletePicture(user.idToken);
            setProfileImg(null);
            showToast("Profile picture deleted.");
        } catch  {
            showToast("Delete failed. Try again.", "error");
        } finally {
            setDeleting(false);
        }
    };

    const initials = (user.displayName || user.email || "U")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

        return (
            <div className="dashboard">
               <div className="topbar">
                  <div className="brand" style={{ marginBottom: 0}}>
                    <div className="brand-icon"><BrandIcon /></div>
                    <span className="brand-name">Pictura</span>
                  </div>
                  <div className="topbar-right">
                      <div className="user-chip">
                         <div className="user-dot"></div>
                         <span className="user-chip-name">{user.email}</span>
                      </div>
                      <button className="btn-ghost" onClick={onLogout}>Sign out</button>
                  </div>
               </div>
               <div className="dashboard-body">
                  <div className="dashboard-content">

                         {toast && (
                            <div className={`alert ${toast.type === "error" ? "alert--error" : "alert--success"} fade-up`}>
                                {toast.msg}
                            </div>
                         )}
                         <div className="profile-card fade-up">
                             <p className="section-label">Your profile</p>

                             <div className="profile-identity">
                                 <div className="avatar-area">
                                   <div className="avatar-ring">
                                       <div className="avatar-inner">
                                           { profileImg
                                              ? <img src={profileImg} alt="profile" className="avatar-img" />
                                              : <span className="avatar-placeholder">{initials}</span>
                                           }
                                           <div className="avatar-overlay" onClick={() => fileInputRef.current?.click()}>
                                             <div className="avatar-overlay-text">
                                                    <CameraIcon />
                                                    Change
                                             </div>
                                           </div>
                                       </div>
                                   </div>
                                 </div>

                                 <div className="profile-meta">
                                      <p className="profile-name">{user.displayName || "User"}</p>
                                      <p className="profile-email">{user.email}</p>
                                      <p className="profile-uid">uid: {user.uid}</p>
                                 </div>
                             </div>
                             <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => handleFile(e.target.files[0])}
                              />
                              <div
                                 className={`upload-zone${dragOver ? " drag-over" : ""}`}
                                 onClick={() => !selectedFile && fileInputRef.current?.click()}
                                 onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                 onDragLeave={() => setDragOver(false)}
                                 onDrop={handleDrop}
                               >
                                {selectedFile ? (
                                    <div className="preview-strip">
                                       <img src={preview} alt="preview" className="preview-thumb" />
                                       <div className="preview-info">
                                          <p className="preview-name">{seledtedFile.name}</p>
                                          <p className="preview-size">{fmtSize(seledtedFile.size)}</p>
                                       </div>
                                       <div className="preview-clear" onClick={(e) => { e.stopPropagation(); clearSelection(); }}>
                                         x
                                       </div>
                                    </div>
                                ) : (
                                    <>
                                    <div className="upload-zone-icon"><UploadIcon /></div>
                                    <p className="upload-zone-title">Drop an image or click to browse</p>
                                    <p className="upload-zone-sub">JPG, PNG, WEBP · Max 2MB</p>
                                    </>
                                )
                            }

                               </div>
                               {
                                uploading && (
                                    <div className="progress-wrap">
                                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                                    </div>
                                )
                               }
                         </div>

                         <div className="actions-panel fade-up-2">
                              <p className="section-label">Actions</p>
                              <div className="action-row">
                                  <button
                                  className="btn-upload"
                                  onClick={handleUpload}
                                  disabled={!seledtedFile || uploading}
                                  >
                                   {uploading
                                     ? <><span className="spinner" /> Uploading</>
                                     : <><UploadIcon /> Save picture</>
                                   }
                                  </button>
                                  <button className="btn-delete" onClick={handleDelete} disabled={!profileImg || deleting || uploading}>
                                      {deleting
                                        ? <><span className="spinner" style={{ borderTopColor: "#fca5a5"}}/> Deleting</>
                                        : <><TrashIcon /> Delete picture</>
                                      }
                                  </button>
                              </div>
                         </div>
                  </div>
               </div>
            </div>
        );
}    