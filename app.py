from flask import Flask, render_template, request, jsonify
import mysql.connector

app = Flask(__name__)
app.secret_key = 'many random bytes'

db = mysql.connector.connect(
    host="interchange.proxy.rlwy.net",
    user="root",
    password="iGWGebkLUeHXdLfuSoDPLIidXVLBMAFl",
    database="railway",
    port=15313  # bu juda muhim!
)

cursor = db.cursor()


@app.route('/')
def index():
    try:
        cur = cur = db.cursor()

        cur.execute("SELECT id, name, features, website, location, duration, tuition, rating, image, course_types FROM data ORDER BY id DESC")
        data = cur.fetchall()
        cur.close()
    except Exception as e:
        return str(e)

    schools = [
        {"id": row[0], "name": row[1], "location": row[4], "tuition": row[6], "duration": row[5], 
        "rating": row[7], "features": row[2], "image": row[8], "website": row[3],"course_types": row[9]} 
        for row in data
    ]
    return render_template('index.html', data=schools)

@app.route('/search')
def search():
    search_query = request.args.get('search', '').strip()

    if not search_query:
        return jsonify({"error": "検索キーワードを入力してください！"}), 400

    query = """
        SELECT id, name, features, website, location, duration, tuition, rating, image, course_types
        FROM data 
        WHERE LOWER(name) LIKE LOWER(%s) OR LOWER(location) LIKE LOWER(%s)
        ORDER BY rating DESC
    """
    params = [f'%{search_query}%', f'%{search_query}%']

    try:
        cur = cur = db.cursor()

        cur.execute(query, params)
        data = cur.fetchall()
        cur.close()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    search_results = [
        {"id": row[0], "name": row[1], "location": row[4], "tuition": row[6], "duration": row[5], 
        "rating": row[7], "features": row[2], "image": row[8], "website": row[3], "course_types": row[9]} 
        for row in data
    ]

    if not search_results:
        return jsonify({"message": "該当する学校が見つかりませんでした。"}), 404

    return jsonify(search_results)


@app.route('/data')
def get_data():
    page = request.args.get('page', 1, type=int)
    limit = 10
    offset = (page - 1) * limit

    try:
        cur = cur = db.cursor()

        cur.execute("SELECT * FROM data ORDER BY id DESC LIMIT %s OFFSET %s", [limit, offset])
        results = cur.fetchall()

        cur.execute("SELECT COUNT(*) FROM data")
        total_items = cur.fetchone()[0]
        cur.close()
    except Exception as e:
        return str(e)

    return jsonify({
        "data": [{"id": row[0], "name": row[1], "location": row[4], "tuition": row[6], "duration": row[5], 
                "rating": row[7], "features": row[2], "image": row[8], "website": row[3],"course_types": row[9]} 
                for row in results],
        "total": total_items,
        "page": page,
        "per_page": limit
    })

@app.route('/filter', methods=['GET'])
def filter_schools():
    region = request.args.get('region')
    max_price = request.args.get('price')
    course_types = request.args.getlist('course_type')  # Multiple course types like ["長期", "短期"]
    page_size = int(request.args.get('page_size', 20))  
    page_num = int(request.args.get('page_num', 1))  

    # Pagination offset
    offset = (page_num - 1) * page_size

    # Base SQL Query
    query = """SELECT id, name, features, website, location, duration, tuition, rating, image, course_types 
                FROM data WHERE 1=1"""
    params = []

    # Count Query for Pagination
    query_count = "SELECT COUNT(*) FROM data WHERE 1=1"
    params_count = []

    # 🔹 Filter by Region
    if region:
        query += " AND location LIKE %s"
        query_count += " AND location LIKE %s"
        params.append(f'%{region}%')
        params_count.append(f'%{region}%')

    # 🔹 Filter by Max Tuition
    if max_price:
        query += " AND tuition <= %s"
        query_count += " AND tuition <= %s"
        params.append(max_price)
        params_count.append(max_price)

    # 🔹 Filter by Course Type ("長期" / "短期")
    if course_types:
        placeholders = ", ".join(["%s"] * len(course_types))  # Creates "%s, %s" dynamically
        query += f" AND course_types IN ({placeholders})"
        query_count += f" AND course_types IN ({placeholders})"
        params.extend(course_types)
        params_count.extend(course_types)

    # 🔹 Get Total Count for Pagination
    cur = cur = db.cursor()

    cur.execute(query_count, params_count)
    total_items = cur.fetchone()[0]
    cur.close()

    # 🔹 Calculate Total Pages
    total_pages = (total_items // page_size) + (1 if total_items % page_size != 0 else 0)

    # 🔹 Add Pagination to the Query
    query += " ORDER BY id DESC LIMIT %s OFFSET %s"
    params.extend([page_size, offset])

    # 🔹 Fetch Data
    cur = cur = db.cursor()

    cur.execute(query, params)
    data = cur.fetchall()
    cur.close()


    filtered_schools = [
        {"id": row[0], "name": row[1], "location": row[4], "tuition": row[6], "duration": row[5], 
        "rating": row[7], "features": row[2], "image": row[8], "website": row[3],
        "course_types": row[9] if row[9] else "N/A"}  # Handle null values
        for row in data
    ]
    
    return render_template('school_list.html', data=filtered_schools, current_page=page_num, 
                            total_pages=total_pages, total_items=total_items, per_page=page_size)   

if __name__ == '__main__':
    app.run(debug=False, host="0.0.0.0", port=5000)