from flask import Flask, render_template, request, send_file, session
import pandas as pd
import os
from io import BytesIO
import uuid
import tempfile

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size
app.secret_key = os.urandom(24)  # Required for sessions

# Create uploads directory if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Create temp directory for storing duplicate CSVs
TEMP_DIR = 'temp_duplicates'
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file part", 400
    
    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400
    
    if file:
        try:
            # Read the CSV file
            df = pd.read_csv(file)
            
            # Identify duplicates across all columns
            # keep=False marks all duplicates (not just the first or last occurrence)
            duplicates = df[df.duplicated(keep=False)]
            
            # Generate a unique ID for this upload session
            session_id = str(uuid.uuid4())
            session['duplicate_file_id'] = session_id
            
            # Save duplicates to a temporary file
            if not duplicates.empty:
                temp_file_path = os.path.join(TEMP_DIR, f"{session_id}.csv")
                duplicates.to_csv(temp_file_path, index=False)
            else:
                session['duplicate_file_id'] = None
            
            # Prepare HTML for display
            return render_template('results.html',
                                  original_data=df.to_html(classes='table table-striped', index=False),
                                  duplicate_data=duplicates.to_html(classes='table table-striped', index=False) if not duplicates.empty else None,
                                  has_duplicates=not duplicates.empty)
        except Exception as e:
            return f"Error processing file: {e}", 500
    
    return "Something went wrong", 500


@app.route('/download_duplicates', methods=['GET'])
def download_duplicates():
    # Retrieve the session ID
    session_id = session.get('duplicate_file_id')
    
    if not session_id:
        return "No duplicates file found. Please upload a CSV file first.", 404
    
    # Construct the file path
    temp_file_path = os.path.join(TEMP_DIR, f"{session_id}.csv")
    
    # Check if the file exists
    if not os.path.exists(temp_file_path):
        return "Duplicates file not found. Please upload a CSV file first.", 404
    
    # Read the CSV file and send it for download
    try:
        return send_file(
            temp_file_path,
            mimetype='text/csv',
            as_attachment=True,
            download_name='duplicates.csv'
        )
    except Exception as e:
        return f"Error downloading file: {e}", 500


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)

