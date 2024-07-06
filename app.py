from flask import Flask, request, redirect, url_for, flash, render_template
from flask_sqlalchemy import SQLAlchemy
import mysql.connector
from mysql.connector import Error
import logging
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost/formulario'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'hola'  # Clave secreta para mensajes flash

db = SQLAlchemy(app)
migrate = Migrate(app, db)

logging.basicConfig(level=logging.DEBUG)

# Configuración de la conexión a la base de datos
def connect_to_database():
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',  # Reemplaza con tu contraseña de MySQL si tienes una
            database='formulario'
        )
        print("Conexión exitosa a la base de datos MySQL")
        return conn
    except Error as e:
        print(f"Error al conectar a MySQL: {e}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

class Contact(db.Model):
    __tablename__ = 'contact'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    consulta = db.Column(db.Text, nullable=False)
    telefono = db.Column(db.String(15))
    documento = db.Column(db.String(12))  # Ajusta el tipo de dato según lo necesites
    opcion_pago = db.Column(db.Text)  # Almacenar opciones separadas por comas
    nacionalidad = db.Column(db.String(100))
    sexo = db.Column(db.String(50))

    def __repr__(self):
        return f'<Contact {self.nombre}>'

@app.route('/buscar_por_nombre', methods=['GET', 'POST'])
def buscar_por_nombre():
    if request.method == 'POST':
        nombre = request.form['name']
        conn = connect_to_database()
        if not conn:
            return "Error al conectar con la base de datos"

        cursor = conn.cursor(dictionary=True)
        try:
            query = "SELECT * FROM contact WHERE nombre LIKE %s"
            cursor.execute(query, (f"%{nombre}%",))
            results = cursor.fetchall()
        except Exception as e:
            print(f"Error al ejecutar la consulta: {e}")
            flash('Error al buscar el contacto', 'danger')
            results = []
        finally:
            cursor.close()
            conn.close()
        
        return render_template('buscar_por_nombre.html', results=results, name=nombre)
    return render_template('buscar_por_nombre.html', results=None)

@app.route('/buscar_por_documento', methods=['GET', 'POST'])
def buscar_por_documento():
    if request.method == 'POST':
        documento = request.form['documento']
        conn = connect_to_database()
        if not conn:
            return "Error al conectar con la base de datos"

        cursor = conn.cursor(dictionary=True)
        try:
            query = "SELECT * FROM contact WHERE documento = %s"
            cursor.execute(query, (documento,))
            results = cursor.fetchall()
        except Exception as e:
            print(f"Error al ejecutar la consulta: {e}")
            flash('Error al buscar el contacto', 'danger')
            results = []
        finally:
            cursor.close()
            conn.close()
        
        return render_template('buscar_por_documento.html', results=results)
    return render_template('buscar_por_documento.html', results=None)

@app.route('/edit_contacto/<int:id>', methods=['GET', 'POST'])
def edit_contacto(id):
    conn = connect_to_database()
    if not conn:
        return "Error al conectar con la base de datos"

    cursor = conn.cursor(dictionary=True)
    contacto = None

    if request.method == 'POST':
        nombre = request.form['nombre']
        email = request.form['email']
        consulta = request.form['consulta']
        telefono = request.form['telefono']
        documento = request.form['documento']
        opcion_pago = request.form['opcion_pago']
        nacionalidad = request.form['nacionalidad']
        sexo = request.form['sexo']

        # Actualizar el contacto en la base de datos
        update_query = """
        UPDATE contact
        SET nombre=%s, email=%s, consulta=%s, telefono=%s, documento=%s, opcion_pago=%s, nacionalidad=%s, sexo=%s
        WHERE id=%s
        """
        try:
            cursor.execute(update_query, (nombre, email, consulta, telefono, documento, opcion_pago, nacionalidad, sexo, id))
            conn.commit()
            flash('Contacto actualizado exitosamente', 'success')
        except mysql.connector.Error as err:
            print(f"Error al actualizar el contacto: {err}")
            flash('Error al actualizar el contacto', 'danger')

        return redirect(url_for('edit_contacto', id=id))
    else:
        # Obtener los datos del contacto para mostrar en el formulario de edición
        try:
            cursor.execute("SELECT * FROM contact WHERE id=%s", (id,))
            contacto = cursor.fetchone()
        except mysql.connector.Error as err:
            print(f"Error al obtener el contacto: {err}")
            flash('Error al obtener el contacto', 'danger')

    cursor.close()
    conn.close()

    return render_template('edit_contacto.html', contacto=contacto)

@app.route('/registro_contactos')
def registro_contactos():
    return render_template('registro_contactos.html')

@app.route('/nosotros')
def nosotros():
    return render_template('nosotros.html')

@app.route('/nuestrosdestinos')
def nuestrosdestinos():
    return render_template('nuestrosdestinos.html')

@app.route('/lista_contactos')
def lista_contactos():
    conn = connect_to_database()
    results = []
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM contact")
        results = cursor.fetchall()
        cursor.close()
        conn.close()
    return render_template('lista_contactos.html', results=results)

@app.route('/delete_contacto/<int:id>/', methods=['GET'])
def delete_contacto(id):
    return_page = request.args.get('return_page', 'registro_contactos')
    conn = connect_to_database()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("DELETE FROM contact WHERE id = %s", (id,))
        conn.commit()
        flash('El contacto ha sido eliminado correctamente', 'success')
    except Exception as e:
        flash(f'Error al eliminar el contacto: {e}', 'error')
    finally:
        cursor.close()
        conn.close()

    return redirect(url_for(return_page))

@app.route('/contacto', methods=['GET', 'POST'])
def contacto():
    if request.method == 'POST':
        nombre = request.form.get('name')
        email = request.form.get('email')
        consulta = request.form.get('consulta')
        telefono = request.form.get('phone')
        documento = request.form.get('documento')
        opcion_pagos = request.form.getlist('opcion_pago')
        opcion_pagos_str = ','.join(opcion_pagos)
        nacionalidad = request.form['nacionalidad']
        sexo = request.form['sexo']
        
        new_contact = Contact(nombre=nombre, email=email, consulta=consulta, telefono=telefono,
                              documento=documento, opcion_pago=opcion_pagos_str,
                              nacionalidad=nacionalidad, sexo=sexo)
        db.session.add(new_contact)
        db.session.commit()
        
        return render_template('confirmacion.html', nombre=nombre, email=email, consulta=consulta, 
                               telefono=telefono, documento=documento, opcion_pago=opcion_pagos_str,  
                               nacionalidad=nacionalidad, sexo=sexo)
    
    return render_template('contacto.html')
    

if __name__ == '__main__':
    app.run(debug=True)
