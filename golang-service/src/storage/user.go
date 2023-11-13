package storage

type UserStorage interface {
	GetUser() string
	InsertUser(u string)
	UpdateUser(u string)
}

func GetUser() string {
	return "SomeUser"
}
