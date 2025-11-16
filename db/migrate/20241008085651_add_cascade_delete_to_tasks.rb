class AddCascadeDeleteToTasks < ActiveRecord::Migration[7.1]
  def change
    # Hapus foreign key yang ada
    remove_foreign_key :tasks, :projects

    # Tambahkan foreign key baru dengan on_delete: :cascade
    add_foreign_key :tasks, :projects, on_delete: :cascade
  end
end
