import tkinter as tk
from tkinter import messagebox, PhotoImage
import sqlite3

# Database Connection
def connect_db():
    conn = sqlite3.connect("ecommerce.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    """)
    conn.commit()
    conn.close()

class LoginApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Eazy-Shop Login")
        self.root.geometry("800x600")
        
        # Load Background Image
        self.bg_image = PhotoImage(file="bag.png")  # Ensure you have a background.png
        self.bg_label = tk.Label(root, image=self.bg_image)
        self.bg_label.place(relwidth=1, relheight=1)
        # Login Frame
        self.login_frame = tk.Frame(root, bg="white", padx=20, pady=20)
        self.login_frame.place(relx=0.5, rely=0.5, anchor="center")
        
        # Title
        self.label = tk.Label(self.login_frame, text="Eazy-Shop", font=("Arial", 24, "bold"), bg="white")
        self.label.pack(pady=10)
        
        # Email Input
        self.username_label = tk.Label(self.login_frame, text="Email:", font=("Arial", 14, "bold"), bg="white")
        self.username_label.pack()
        self.username_entry = tk.Entry(self.login_frame, font=("Arial", 14), width=30, bg="lightgrey")
        self.username_entry.pack(pady=5)
        
        # Password Input
        self.password_label = tk.Label(self.login_frame, text="Password:", font=("Arial", 14, "bold"), bg="white")
        self.password_label.pack()
        self.password_entry = tk.Entry(self.login_frame, show="*", font=("Arial", 14), width=30, bg="lightcoral")
        self.password_entry.pack(pady=5)
        
        # Login Button
        self.login_button = tk.Button(self.login_frame, text="Sign In", font=("Arial", 14, "bold"), bg="white", command=self.login)
        self.login_button.pack(pady=10)
        
        # Sign Up Button
        self.signup_button = tk.Button(self.login_frame, text="Sign Up", font=("Arial", 14, "bold"), bg="lightgrey", command=self.signup)
        self.signup_button.pack()
        
        # Tagline
        self.tagline = tk.Label(root, text="A NEW APPROACH OF SHOPPING", font=("Arial", 16, "bold"), bg="white")
        self.tagline.place(relx=0.5, rely=0.9, anchor="center")
    
    def login(self):
        username = self.username_entry.get()
        password = self.password_entry.get()
        
        conn = sqlite3.connect("ecommerce.db")
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
        user = cursor.fetchone()
        conn.close()
        
        if user:
            messagebox.showinfo("Login Successful", "Welcome to Eazy-Shop!")
            self.root.destroy()
            main()
        else:
            messagebox.showerror("Login Failed", "Invalid email or password")
    
    def signup(self):
        messagebox.showinfo("Sign Up", "Sign up functionality coming soon!")

if __name__ == "__main__":
    connect_db()
    login_root = tk.Tk()
    login_app = LoginApp(login_root)
    login_root.mainloop()

def main():
    root = tk.Tk()
    root.title("Eazy-Shop Main Page")
    root.geometry("800x600")
    tk.Label(root, text="Welcome to Eazy-Shop!", font=("Arial", 24, "bold")).pack(pady=50)
    root.mainloop()