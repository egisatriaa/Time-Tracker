class Task < ApplicationRecord
  belongs_to :user
  belongs_to :project

  has_one :log_task, class_name: 'LogTask'
end
