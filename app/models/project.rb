class Project < ApplicationRecord
  belongs_to :user

  # Relasi many-to-many
  has_many :project_members, dependent: :destroy
  has_many :users, through: :project_members

  validates :name, presence: true
  validates :tasks, presence: true

  has_many :tasks, dependent: :destroy
  accepts_nested_attributes_for :tasks, allow_destroy: true, reject_if: :all_blank
end
