class CreateLogTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :log_tasks do |t|
      t.string :notes
      t.date :date
      t.string :timer
      t.references :user, null: false, foreign_key: true
      t.references :task, null: false, foreign_key: true

      t.timestamps
    end
  end
end
