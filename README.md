# Car Showcase Demo

Demo triển lãm xe hơi 3D trên web: showroom nhỏ, đổi màu sơn, menu thuật ngữ chuyên môn ô tô và camera tự động focus vào từng bộ phận.

**Stack:** Three.js + HTML/CSS/JavaScript (không build) · deploy GitHub Pages.

## Tài liệu

Nghiên cứu thị trường (demo tương tự) và kế hoạch triển khai chi tiết:

→ **[docs/RESEARCH-AND-PLAN.md](docs/RESEARCH-AND-PLAN.md)**

## Trạng thái

- Repo đã bật GitHub Pages
- `index.html` đang placeholder — chờ triển khai theo plan (Phase 0–3)

## Chạy local (sau khi có code)

```bash
python3 -m http.server 8080
# mở http://127.0.0.1:8080/
```

Không mở trực tiếp `file://` — GLTF/Draco cần HTTP.
