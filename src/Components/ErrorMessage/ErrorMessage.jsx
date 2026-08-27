import { Alert } from "@heroui/react";
import React from "react";

export default function ErrorMessage({errorMessage}) {  
    return (
    <>
     {errorMessage && <Alert status="danger" className="mt-1 bg-red-300 rounded-2xl">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{errorMessage.message}</Alert.Title>
        </Alert.Content>
      </Alert>}
    </>
  );
}
