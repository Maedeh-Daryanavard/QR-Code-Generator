from flask import Flask, render_template, request, send_file, jsonify
import qrcode
import segno
import os
import uuid

app = Flask(__name__)

GENERATED_FOLDER = "generated"
UPLOAD_FOLDER = "uploads"

os.makedirs(GENERATED_FOLDER, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def build_qr_data(qr_type, form):
    if qr_type == "url":
        return form.get("url", "")

    if qr_type == "text":
        return form.get("text", "")

    if qr_type == "email":
        return f"mailto:{form.get('email')}?subject={form.get('subject')}&body={form.get('body')}"

    if qr_type == "phone":
        return f"tel:{form.get('phone')}"

    if qr_type == "wifi":
        return f"WIFI:T:{form.get('security')};S:{form.get('ssid')};P:{form.get('password')};;"

    if qr_type == "maps":
        return form.get("maps", "")

    if qr_type == "event":
        return f"""BEGIN:VEVENT
SUMMARY:{form.get('event_title')}
LOCATION:{form.get('event_location')}
DESCRIPTION:{form.get('event_description')}
DTSTART:{form.get('start_date').replace('-', '')}T{form.get('start_time').replace(':', '')}00
DTEND:{form.get('end_date').replace('-', '')}T{form.get('end_time').replace(':', '')}00
END:VEVENT"""

    if qr_type == "vcard":
        return f"""BEGIN:VCARD
VERSION:3.0
FN:{form.get('name')}
TEL:{form.get('phone')}
EMAIL:{form.get('email')}
ORG:{form.get('company')}
TITLE:{form.get('job')}
URL:{form.get('website')}
END:VCARD"""

    return ""


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    qr_type = request.form.get("qr_type")
    qr_data = build_qr_data(qr_type, request.form)

    if not qr_data.strip():
        return jsonify({"error": "Please fill the required fields."}), 400

    file_id = str(uuid.uuid4())
    png_path = os.path.join(GENERATED_FOLDER, f"{file_id}.png")
    svg_path = os.path.join(GENERATED_FOLDER, f"{file_id}.svg")

    img = qrcode.make(qr_data)
    img.save(png_path)

    qr_svg = segno.make(qr_data)
    qr_svg.save(svg_path, scale=8)

    return jsonify({
        "png_url": f"/download/png/{file_id}",
        "svg_url": f"/download/svg/{file_id}",
        "preview_url": f"/download/png/{file_id}"
    })


@app.route("/download/png/<file_id>")
def download_png(file_id):
    path = os.path.join(GENERATED_FOLDER, f"{file_id}.png")
    return send_file(path, as_attachment=True)


@app.route("/download/svg/<file_id>")
def download_svg(file_id):
    path = os.path.join(GENERATED_FOLDER, f"{file_id}.svg")
    return send_file(path, as_attachment=True)


if __name__ == "__main__":
    app.run(debug=True)