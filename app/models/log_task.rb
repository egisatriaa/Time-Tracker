class LogTask < ApplicationRecord
  belongs_to :user
  belongs_to :task

  validates :timer, presence: true
  validates :task_id, presence: true
end
