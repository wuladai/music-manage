export const mixin = {
    methods: {
        /**
         * 提示信息
         */
        notify (title, type) {
            this.$notify({
                title: title,
                type: type
            })
        },

        /**
         * 根据（img）相对地址获取绝对地址
         */
        getUrl (url) {
            return `${this.$store.state.HOST}/${url}`
        },

        /**
         * 根据数字获取到中文性别
         */
        changeSex (value) {
            if (value == 0) {
                return '女'
            } else if (value == 1) {
                return '男'
            } else if (value == 2) {
                return '组合'
            } else if (value == 3) {
                return '不明'
            } else {
                return value
            }
        },

        /**
         * 获取生日
         */
        attachBirth (val) {
            return String(val).substr(0, 10)
        },

        /**
         * 图片上传之前需要做的一些校验
         */
        beforAvatorUpload (file) {
            //先判断是否为图片
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')
            if (!isJPG) {
                this.$message.error('上传图片只能是jpg或png格式')
                return false
            }
            // 文件大小
            const isLt2M = file.size / (1024 * 1024) < 2
            if (!isLt2M) {
                this.$message.error('上传图片不可以超过2M')
                return false
            }

            return true
        },

        /**
         * 上传图片成功之后要做的校验
         */
        handleAvatorSuccess (res) {
            let _this = this     //this表示操作的当前页面
            if (res.code == 1) {
                // 成功则刷新一下页面，即重新查询一下
                _this.getData()
                _this.$notify({
                    title: '图片上传成功',
                    type: 'success'
                })
            } else {
                _this.$notify({
                    title: '图片上传失败',
                    type: 'error'
                })
            }
        },

        /**
         * 弹出删除窗口，并确定预删除的选中项select_index。
         * 只有确定了选中项，才可以执行删除操作deleteRow()
         */
        handleDelete (id) {
            this.select_index = id
            this.delDialogVisible = true
        },

        /**
         * 把批量删除的选中项赋值给变量multipleSelection
         */
        handleSelectionChange (val) {
            this.multipleSelection = val
        },

        /**
         * 批量删除选中项
         */
        delAll () {
            for (let item of this.multipleSelection) {
                //先确定选中项
                this.handleDelete(item.id)
                //再执行删除操作（已经包含有刷新操作了）
                this.deleteRow()
            }
            //删除完之后清空multipleSelection
            this.multipleSelection = []
        },
    }
}
