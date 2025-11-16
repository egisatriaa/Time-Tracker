class User < ApplicationRecord
  has_secure_password

  validates :email, presence: true, uniqueness: true
  normalizes :email, with: ->(email) { email.strip.downcase }

  generates_token_for :password_reset, expires_in: 15.minutes do
    password_salt&.last(10)
  end

  generates_token_for :email_confirmation, expires_in: 24.hours do
    email
  end

  # Relasi dengan Tim
  belongs_to :team, optional: true

  # Definisikan peran pengguna dengan enum
  enum role: { team_member: 0, admin: 1 }

  has_many :projects
  has_many :tasks
  has_many :log_tasks, class_name: 'LogTask'

  # Fungsi untuk memeriksa apakah user adalah admin
  def admin?
    role == 'admin'
  end
end
